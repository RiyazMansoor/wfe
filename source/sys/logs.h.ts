/**
 * A sub-system to log user and system actions happening in this project.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20220920 v0.1
 */


import { T_DateRange, T_Timestamp, T_IndId, T_ServiceClientId, T_EntityId, T_EntityKind } from "./types.h";

/**
 * Type for audit log entry for a user or system action.
 * There is no primary key.
 * @timestamp When the action happened.
 * @executor Individual executing the action.
 * @executingfFr Client on whose behalf the action was executed.
 * @entityKind The enity kind (or type) on which the action was executed.
 * @entityId The entity id on which the action was executed.
 * @details The description of the action.
 */
type T_LogRecord = {
    timestamp: T_Timestamp,
    executor: T_IndId,
    executingFor: T_ServiceClientId,
    entityKind: T_EntityKind,
    entityId: T_EntityId,
    details: string
}

/**
 * Interface to interact with type structure T_LogRecord.
 * This interface is for internal processes - to log user or system actions.
 * Implementation must be a singleton structure that all can access.
 */
interface I_LogRecord {

    /**
     * Inserts a new log record.
     * @param executor Individual executing the action.
     * @param executingFor Client on whose behalf the action was executed.
     * @param entityKind The enity kind (or type) on which the action was executed.
     * @param entityId The entity id on which the action was executed.
     * @param details The description of the action.
     */
    log(executor: T_IndId, executingFor: T_ServiceClientId,
        entityKind: T_EntityKind, entityId: T_EntityId, details: string): void;

}

/**
 * Interface to interact with type structure I_LogRocord.
 * This interface is for sys admins - to review/trace issues. 
 */
interface API_LogRecordFetch {

    /**
     * Returns all records for the supplied date range.
     * Fine searching or filtering must happen on the client.
     * @param dateRange The date range to search.
     * @returns All records for the supplied date range.
     */
    fetch(dateRange: T_DateRange): T_LogRecord[];

}


