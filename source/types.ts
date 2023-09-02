/**
 * 
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20230901
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
 * Type for Datetime timestamp - representated as ISO string with timezone.
 */
export type T_Timestamp = string;

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
 * A type for data types used in this project JSON
 */
export type StrNum = string | number ;
 
/**
 * Type for representing a data record - parameter name -> parameter value.
 */ 
export type DataMap = Map<string, StrNum> ;

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

