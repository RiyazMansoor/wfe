/**
 * 
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20230901
 */



/**
 * Type for Datetime timestamp - representated as ISO string with timezone.
 */
export type Timestamp = string;

/**
 * Authorization id of system users.
 */
export type AuthId = string;

/**
 * Structure of a audit log entry
 */
export type AuditLog = {
    timestamp: Timestamp,
    authId: AuthId,
    logType: string,
    logText: string
}


/**
 * Type for integers.
 */
export type T_Integer = number;

/**
 * Type for Date - representated as ISO string yyyymmdd.
 */
export type T_Email = string;

/**
 * Type for Date - representated as ISO string yyyymmdd.
 */
export type T_Date = string;

/**
 * HTML text.
 */
export type T_HTML = string;

/**
 * A url.
 */
export type T_URL = string;

/**
 * Storage type - a valid JSON string.
 */
export type T_JsonStr = string;

                                                                                                                                                                                              /**
 * All data within a workflow is either a string or a number
 */
export type T_Datum = string | number | T_DataObj ;

/**
 * The representation of all business data contained within any workflow.
 */
export type T_DataObj = { 
    [key: string]: Datum 
}



/**
 * Type for a ate range.
 */
export type T_DateRange = {
    from: T_Date,
    to: T_Date
}

/**
 * Uinque identifiers for individuals.
 */
export type T_IndId = string;

/**
 * Unique identifiers for organizations.
 */
export type T_OrgId = string;

export type T_SysId = string;

/**
 * Class names as strings.
 */
export type T_ClassName = string;

