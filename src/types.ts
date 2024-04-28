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
 * This type requires conversion.
 * By convention, any field name that ends in "Date" will be converted.
 */
export type T_Date = string;

/**
 * Type for Datetime timestamp - representated as ISO string with timezone.
 * This type requires conversion.
 * By convention, any field name that ends in "Timestamp" will be converted.
 */
export type T_Timestamp = string;

/**
 * Type for Class names.
 */
export type T_ClassName = string;

/**
 * Type for Class Instance unique ids.
 */
export type T_Instance = string;

