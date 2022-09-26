/**
 * A sub-system to log user and system actions happening in this project.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20220920 v0.1
 */


import { T_DateRange, T_Timestamp, T_IndId, T_ServiceClientId, T_JsonStr, T_DataObject, T_DataType } from "./types";
import { T_Entity, AbstractEntity, T_EntityType, DbConnections, T_DbTypeCriteria } from "./store";
import { timestamp, executorId, executingForId, dbFieldCriteriaDateRangeIn, dbFieldCriteriaEqual } from "./util";


/**
 * 
 */
enum E_EntityAction { READ = "READ", WRITE = "WRITE" }

/**
 * Type for audit log entry for a user or system action.
 * @timestamp When the action happened.
 * @executor Individual executing the action.
 * @executingFor Client on whose behalf the action was executed.
 * @entityType The enity type on which the action was executed.
 * @entityAction Can be on of READ (list, search, view) or WRITE (insert, update, delete) actions.
 * @entityData The criteria to READ or json string of the entity data after the action was executed.
 * @details The description of the action.
 */
type T_Log = {
    timestamp: T_Timestamp,
    executor: T_IndId,
    executingFor: T_ServiceClientId,
    entityType: T_EntityType,
    entityAction: E_EntityAction,
    entityData: T_JsonStr,
    details: string
}

/**
 * Interface to interact with type structure T_LogRecord.
 * This interface is for internal processes - to log user or system actions.
 * Implementation must be a singleton structure that all can access.
 */
interface I_LogActions {

    /**
     * Inserts a new log record.
     * @param entityType The enity kind (or type) on which the action was executed.
     * @param entityAction Can be on of READ (list, search, view) or WRITE (insert, update, delete) actions.
     * @param entityData The criteria to READ or json string of the entity data after the action was executed.
     * @param details The description of the action.
     */
    log(entityType: T_EntityType, entityAction: E_EntityAction,
        entityData: T_JsonStr, details: string): void;

}

/**
 * This interface is for sys admins - to review/trace issues. 
 * It is expected that finer searching, filtering will happen client side.
 */
interface I_LogAPI {

    /**
     * @param dateRange The date range to search.
     * @returns All records for the supplied criteria.
     */
    fetch(dateRange: T_DateRange): T_Entity[];

    /**
     * @param dateRange The date range to search.
     * @param executor The individual who effected the log action.
     * @returns All records for the supplied criteria.
     */
    fetchByExecutor(dateRange: T_DateRange, executor: T_IndId): T_Entity[];

    /**
     * @param dateRange The date range to search.
     * @param entityType The entity type of the log action.
     * @returns All records for the supplied criteria.
     */
    fetchByEntity(dateRange: T_DateRange, entityType: T_EntityType): T_Entity[];

}



/**
 * Entity class for a Log object.
 */
export class LogEntity extends AbstractEntity implements I_LogActions {

    private logRecord: T_Log;

    constructor(entity?: T_Entity) {
        super(entity);
        if (entity) {
            this.logRecord = entity.entityData as T_Log;
        }
    }

    log(entityType: T_EntityType, entityAction: E_EntityAction,
        entityData: T_JsonStr, details: string): void {
        if (this.logRecord) {
            throw `LogRecord :: log() called to overwrite existing data`;
        }
        this.logRecord = {
            timestamp: timestamp(),
            executor: executorId(),
            executingFor: executingForId(),
            entityType: entityType,
            entityAction: entityAction,
            entityData: entityData,
            details: details
        };
        DbConnections.getInstance().dbInsert(this.toJSON());
    }

    /**
     * @see super.toJSON()
     * @throws If there is no information to log.
     * @returns The plain JSON log object.
     */
    toJSON(): T_Entity {
        if (!this.logRecord) {
            throw `LogRecord :: toJSON() called without any log data`;
        }
        const entity = super.toJSON();
        entity.entityData = JSON.parse(JSON.stringify(this.logRecord));
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


