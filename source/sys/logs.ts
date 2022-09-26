/**
 * A sub-system to log user and system actions happening in this project.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20221020 v0.1
 */


import { T_DateRange, T_Timestamp, T_IndId, T_DataObject, T_OrgId, T_ApiName } from "./types";
import { T_Entity, AbstractEntity, T_EntityType, DbConnections, T_DbTypeCriteria, dbFieldCriteriaDateRangeIn, dbFieldCriteriaEqual } from "./store";
import { timestamp, executorId, executingForId } from "./util";


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
    fetchByEntity(dateRange: T_DateRange, entityType: T_EntityType): T_Entity[];

}



/**
 * Entity class for a Log object.
 */
export class LogEntity extends AbstractEntity {

    private log: T_Log;

    constructor(entity: T_Entity) {
        super(entity);
        this.log = {
            timestamp: entity.entityData.timestamp as T_Timestamp,
            executor: entity.entityData.executor as T_IndId,
            executingFor: entity.entityData.executingFor as T_IndId,
            api: entity.entityData.api as T_ApiName,
            parameters: entity.entityData.parameters as T_DataObject,
            result: E_LogResult[entity.entityData.result as string],
            details: entity.entityData.details as string
        };
    }

    /**
     * @see super.toJSON()
     * @throws If there is no information to log.
     * @returns The plain JSON log object.
     */
    toJSON(): T_Entity {
        const entity = super.toJSON();
        entity.entityData = JSON.parse(JSON.stringify(this.log));
        return entity;
    }

}

export class LogAPI implements I_LogAPI {

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
        if (!LogAPI.logAPI) {
            LogAPI.logAPI = new LogAPI();
        }
        return LogAPI.logAPI;
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
            entityType: LogEntity.constructor.name,
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

    fetchByEntity(dateRange: T_DateRange, entityType: T_EntityType): T_Entity[] {
        const criteria: T_DbTypeCriteria = {
            timestamp: dbFieldCriteriaDateRangeIn(dateRange),
            entityType: dbFieldCriteriaEqual(entityType),
        }
        return this.dbSearch(criteria);
    }

}


