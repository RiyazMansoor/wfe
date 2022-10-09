/**
 * A sub-system to log user and system actions happening in this project.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20221020 v0.1
 */


import { T_DateRange, T_Timestamp, T_IndId, T_DataObject, T_OrgId, T_ApiName } from "./types";
import { T_Entity, AbstractEntity, T_CollectionId, DbConnections, T_DbTypeCriteria, dbFieldCriteriaDateRangeIn, dbFieldCriteriaEqual } from "./store";
import { timestamp, executorId, executingForId } from "./util";
import { WithFieldValue, DocumentData, QueryDocumentSnapshot, SnapshotOptions, FirestoreDataConverter, PartialWithFieldValue, SetOptions, Timestamp } from "firebase/firestore";


/**
 * The result of user actions (API calls) for log purposes.
 */
export enum E_LogResult {
    COMPLETED_SUCCESS = "COMPLETED_SUCCESS",
    COMPLETED_FAILURE = "COMPLETED_FAILURE",
    UNEXPECTED_ERROR = "UNEXPECTED_ERROR"
}

/**
 * Type for audit log entry for a user or system action.
 * @timestamp When the action happened.
 * @executor Individual executing the action.
 * @executingFor Client on whose behalf the action was executed.
 * @api The API called.
 * @parameters The parameters called with.
 * @result One of { Success, Failure, Error }.
 * @details The detaisl - eg; Error description for Error result.
 */
type T_Log = {
    timestamp: T_Timestamp,
    executor: T_IndId,
    executingFor: T_IndId | T_OrgId,
    api: T_ApiName,
    parameters: T_DataObject,
    result: E_LogResult,
    details: string
}

class LogConverter implements FirestoreDataConverter<T_Log> {

    
    toFirestore(modelObject: WithFieldValue<T_Log>): DocumentData {
        const docdata: DocumentData = {
            timestamp: Timestamp.fromMillis(0), //modelObject.timestamp),
            executor: modelObject.executor,
            executingFor: modelObject.executingFor,
            api: modelObject.api,
            parameters: modelObject.parameters,
            result: E_LogResult[modelObject.result],
            details: modelObject.details
        };
    }
    
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): T_Log {
        const data = snapshot.data(options)!;
        const log: T_Log = {
            timestamp: data.timestamp,
            executor: data.executor,
            executingFor: data.executingFor,
            api: data.api,
            parameters: data.parameters,
            result: E_LogResult[data.result],
            details: data.details
        }
        return log;
    }
    
}


class Post {
    constructor(readonly title: string, readonly author: string) {}
  
    toString(): string {
      return this.title + ', by ' + this.author;
    }
  }
  
  const postConverter = {
    toFirestore(post: WithFieldValue<Post>): DocumentData {
      return {title: post.title, author: post.author};
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): Post {
      const data = snapshot.data(options)!;
      return new Post(data.title, data.author);
    }
  };
  
  const postSnap = await firebase.firestore()
    .collection('posts')
    .withConverter(postConverter)
    .doc().get();
  const post = postSnap.data();
  if (post !== undefined) {
    post.title; // string
    post.toString(); // Should be defined
    post.someNonExistentProperty; // TS error
  }

  
/**
 * This interface is for sys admins - to review/trace issues. 
 * It is expected that finer searching, filtering will happen client side.
 */
export interface I_LogAPI {

    /**
     * Inserts a new log record.
     * It is expected this method will be called from all over, but internally.
     * Hence, NO role access restrictions.
     * @see T_Log for parameter information
     */
    log(api: T_ApiName, parameters: T_DataObject, result: E_LogResult, details: string): void;

    /**
     * Log access will be restricted to specific roles.
     * @param dateRange The date range to search.
     * @returns All records for the supplied criteria.
     */
    fetch(dateRange: T_DateRange): T_Entity[];

    /**
     * Log access will be restricted to specific roles.
     * @param dateRange The date range to search.
     * @param executor The individual who effected the log action.
     * @returns All records for the supplied criteria.
     */
    fetchByExecutor(dateRange: T_DateRange, executor: T_IndId): T_Entity[];

    /**
     * Log access will be restricted to specific roles.
     * @param dateRange The date range to search.
     * @param entityType The entity type of the log action.
     * @returns All records for the supplied criteria.
     */
    fetchByEntity(dateRange: T_DateRange, entityType: T_CollectionId): T_Entity[];

}



/**
 * Entity class for a Log object.
 */
export class LogEntity extends AbstractEntity {

    private log: T_Log;

    constructor(entity: T_Entity) {
        super(entity);
        this.log = LogEntity.toTypescript(entity.entityData);
    }

    static toTypescript(plainJSON: T_DataObject): T_Log {
        const log: T_Log = {
            timestamp: plainJSON.timestamp as T_Timestamp,
            executor: plainJSON.executor as T_IndId,
            executingFor: plainJSON.executingFor as T_IndId,
            api: plainJSON.api as T_ApiName,
            parameters: plainJSON.parameters as T_DataObject,
            result: E_LogResult[plainJSON.result as string],
            details: plainJSON.details as string
        };
        return log;
    }

    protected getEntityDataAsJsonStr(): string {
        return JSON.stringify(this.log);
    }

    protected getUniqueIndexCriteria(): T_DbTypeCriteria {
        const criteria: T_DbTypeCriteria = {
        }
        return criteria;
    }

}

export class MemoryDbLogAPI implements I_LogAPI {

    /**
     * The singleton instance of the Log API.
     */
    private static logAPI: I_LogAPI;

    private constructor() {
        // empty private constructor for singleton
    }

    /**
     * @returns The singleton instance of Log API
     */
    static getInstance(): I_LogAPI {
        if (!MemoryDbLogAPI.logAPI) {
            MemoryDbLogAPI.logAPI = new MemoryDbLogAPI();
        }
        return MemoryDbLogAPI.logAPI;
    }

    /**
     * Calls the database search.
     * @param criteria The search criteria.
     * @returns The matching data entities.
     */
    private dbSearch(criteria: T_DbTypeCriteria): T_Entity[] {
        return DbConnections.getInstance().dbSearch(criteria, LogEntity.constructor.name);
    }

    log(api: T_ApiName, parameters: T_DataObject, result: E_LogResult, details: string): void {
        const log: T_Log = {
            timestamp: timestamp(),
            executor: executorId(),
            executingFor: executingForId(),
            api: api,
            parameters: parameters,
            result: result,
            details: details
        };
        const entity: T_Entity = {
            collectionId: LogEntity.constructor.name,
            entityData: JSON.parse(JSON.stringify(log))
        }
        DbConnections.getInstance().dbInsert(entity);
    }

    fetch(dateRange: T_DateRange): T_Entity[] {
        const criteria: T_DbTypeCriteria = {
            timestamp: dbFieldCriteriaDateRangeIn(dateRange),
        }
        return this.dbSearch(criteria);
    }

    fetchByExecutor(dateRange: T_DateRange, executor: T_IndId): T_Entity[] {
        const criteria: T_DbTypeCriteria = {
            timestamp: dbFieldCriteriaDateRangeIn(dateRange),
            executor: dbFieldCriteriaEqual(executor),
        }
        return this.dbSearch(criteria);
    }

    fetchByEntity(dateRange: T_DateRange, entityType: T_CollectionId): T_Entity[] {
        const criteria: T_DbTypeCriteria = {
            timestamp: dbFieldCriteriaDateRangeIn(dateRange),
            entityType: dbFieldCriteriaEqual(entityType),
        }
        return this.dbSearch(criteria);
    }

}


