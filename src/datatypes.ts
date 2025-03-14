/**
 * The fundamental types used in this project.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20221020 v0.1
 * @modified 2025315 riyaz.mansoor@gmail.com
 */



/**
 * Type for integer numbers.
 */
export type TInteger = number;

/**
 * Type for decimal numbers.
 */
export type TDecimal = number;

/**
 * Type for a date as a number from the epoch.
 */
export type TDate = number;

/**
 * Type for a time as a number.
 */
export type TTime = number;

/**
 * Type for a timestamp as a decimal number.
 */
export type TTimestamp = number;

/**
 * Type for a date as a string representated as ISO string yyyy-mm-dd.
 */
export type TDateStr = string;

/**
 * Type for a time as a string representated as ISO string hh:mm:ss.
 */
export type TTimeStr = string;

/**
 * Type for a datetime timestamp as a string representated as ISO string with timezone.
 */
export type TTimestampStr = string;

/**
 * Type for email.
 */
export type TEmail = string;

/**
 * Type for Maldivian national identity card number.
 */
export type TMaldivianID = string;

/**
 * Type for a key string.
 */
export type TKey = string;

/**
 * Type for HTML content string.
 */
export type THtml = string;

/**
 * Collection of data types.
 */
export type TDataTypes = TInteger | TDecimal | TDate | TTime | TTimestamp | TDateStr | TTimeStr | TTimestampStr | TEmail | TMaldivianID | THtml | string ;

/**
 * Recursively defined data object
 */
export type TData = {
    [index: string]: TDataTypes | TData
}
