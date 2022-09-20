

/**
 * Type for audit log entry for a user or system action.
 * There is no primary key.
 * @timestamp When the action happened.
 * @executor Person executing the action.
 * @executingfor Client on whose behalf the action was executed.
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
     * Parameter @timestamp is replaced by the system timestamp.
     * @param logRecord The log record to insert.
     */
    log(logRecord: T_LogRecord): void ;

}

/**
 * Interface to interact with type structure I_LogRocord.
 * This interface is for sys admins - to review/trace issues. 
 */ 
interface I_LogRecordSearch {

    /**
     * Returns all matching records matching search criteria.
     * Parameter @timestamp is searched with + or - 30 days, if illegal then for the past 30 days.
     * parameter @details is not applied in search.
     * @param searchCriteria Contains the partial string parameters as search criteria.
     */
    search(searchCriteria: T_LogRecord): T_LogRecord[] ;

}


