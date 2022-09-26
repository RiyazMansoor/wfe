/**
 * The fundamental types used in this project.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20221020 v0.1
 */



/**
 * Type for integers.
 */
export type T_Integer = number;

/**
 * Type for Date - representated as ISO string yyyymmdd.
 */
export type T_Date = string;

/**
 * Type for a ate range.
 */
export type T_DateRange = {
    from: T_Date,
    to: T_Date
}

/**
 * Type for Datetime timestamp - representated as ISO string with timezone.
 */
export type T_Timestamp = string;

/**
 * Uinque identifiers for individuals.
 */
export type T_IndId = string;

/**
 * Unique identifiers for organizations.
 */
export type T_OrgId = string;


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
 * Identify API names as used in the system.
 */
export type T_ApiName = string;

/**
* Fundamentally, all data in this sytem will be either string or number.
*/
export type T_DataType = string | number;

/**
 * A container object for data. 
 * Keys can be any string. Can be any depth.
 */
export type T_DataObject = {
    [index: string]: T_DataType | T_DataObject
}




