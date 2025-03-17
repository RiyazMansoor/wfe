/**
 * The fundamental types used in this project.
 * Basic support methods such as 
 * type convertions from string to number
 * and validations such as email or number range.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 2025315
 */

// private helper function
function ifNaN(value: number): "N/A" | number {
    return isNaN(value) ? "N/A" : value;
}

/**
 * Type for a range of numbers. Minimum value is inclusive.
 */
export type TNumberRange = {
    minValue? : number,
    maxValue? : number
}

/**
 * Type for integer numbers.
 */
export type TInteger = number;

/**
 * Temporary transient type for TInteger as a string.
 */
export type TIntegerStr = string;

/**
 * Validates and returns the correct integer, if the value is within the number range.
 * @param value number or string representing the integer.
 * @param options number range to validate the value.
 * @returns the correct integer.
 */
export function validateInteger(value: TInteger | TIntegerStr, options?: TNumberRange): TInteger {
    const minValue: number = options?.minValue ?? NaN;
    const maxValue: number = options?.maxValue ?? NaN;
    const msgBound = `min >= [${ifNaN(minValue)}] and max < [${ifNaN(maxValue)}].`;
    let valueInt: TInteger;
    if (typeof value === 'string') {
        valueInt = parseInt(value);
        if (isNaN(valueInt)) {
            const msg = `Integer parse error : val [${value}] : ${msgBound}.`;
            throw { msg: msg, value: value, options: options };
        }
    } else {
        valueInt = value;
    }
    if ((!isNaN(minValue) && valueInt < minValue) || (!isNaN(maxValue) && valueInt < maxValue)) {
        const msg = `Integer out of range error : val [${value}] : ${msgBound}.`;
        throw { msg: msg, value: value, options: options };
    }
    return valueInt;
}


/**
 * Type for Float numbers.
 */
export type TFloat = number;

/**
 * Temporary transient type for TFloat as a string.
 */
export type TFloatStr = string;

/**
 * Validates and returns the correct Float, if the value is within the number range.
 * @param value number or string representing the Float.
 * @param options number range to validate the value.
 * @returns the correct Float.
 */
export function validateFloat(value: TFloat | TFloatStr, options?: TNumberRange): TFloat {
    const minValue: number = options?.minValue ?? NaN;
    const maxValue: number = options?.maxValue ?? NaN;
    const msgBound = `min >= [${ifNaN(minValue)}] and max < [${ifNaN(maxValue)}].`;
    let valueFloat: TFloat;
    if (typeof value === 'string') {
        valueFloat = parseFloat(value);
        if (isNaN(valueFloat)) {
            const msg = `Float parse error : val [${value}] : ${msgBound}.`;
            throw { msg: msg, value: value, options: options };
        }
    } else {
        valueFloat = value;
    }
    if ((!isNaN(minValue) && valueFloat < minValue) || (!isNaN(maxValue) && valueFloat < maxValue)) {
        const msg = `Float out of range error : val [${value}] : ${msgBound}.`;
        throw { msg: msg, value: value, options: options };
    }
    return valueFloat;
}


    
/**
 * Type for a date as a number from the epoch.
 */
export type TDate = number;

/**
 * Type for a date as a string representated as ISO string yyyy-mm-dd.
 */
export type TDateStr = string;

/**
 * Type for a time as a number.
 */
export type TTime = number;

/**
 * Type for a time as a string representated as ISO string hh:mm:ss.
 */
export type TTimeStr = string;

/**
 * Type for a timestamp as a Float number.
 */
export type TTimestamp = number;

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
export type TDataTypes = TInteger | TFloat | TDate | TTime | TTimestamp | TDateStr | TTimeStr | TTimestampStr | TEmail | TMaldivianID | THtml | string ;

/**
 * Recursively defined data object
 */
export type TData = {
    [index: string]: TDataTypes | TData
}
