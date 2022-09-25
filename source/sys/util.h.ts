/**
 * Common functions.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20220920
 */


import { F_DbFieldCriteria } from "./store";
import { T_DataType, T_Date, T_DateRange, T_IndId, T_Integer, T_Timestamp } from "./types.h";

/**
 * Returns a random alphanumeric string of supplied length.
 * @param length The length of the random string.
 * @return The random alphanumeric string.
 */
export function randomString(length: T_Integer = 64): string {
    let id: string = "";
    while (id.length < length) {
        id += Math.random().toString(36).substring(2);
    }
    return id.substring(0, length);
}

/**
 * Returns the timestamp for the supplied date object.
 * @param datetime The date object to convert to T_Timestamp.
 * @returns The timestamp for the supplied date object.
 */
export function timestamp(datetime: Date = new Date()): T_Timestamp {
    return datetime.toISOString();
}

/**
 * @returns The unique identifier of the executing individual.
 */
export function executorId(): T_IndId {
    return "TODO";
}

/**
 * If the executor is impersonating another, then returns the impersonated id
 * If not impersonating, returns the same as @executorId
 * @see executorId()
 * @returns The unique identifier of the impersonated.
 */
export function executingForId(): T_IndId {
    return "TODO";
}




export function dbFieldCriteriaDateRangeIn(dateRange: T_DateRange): F_DbFieldCriteria {
    const dateFrom: Date = new Date(dateRange.from);
    const dateTo: Date = new Date(dateRange.to);
    return (value: T_DataType) => {
        const dateTest = new Date(value);
        return dateFrom <= dateTest && dateTest <= dateTo;
    }
}

export function dbFieldCriteriaDateRangeNotIn(dateRange: T_DateRange): F_DbFieldCriteria {
    const func = dbFieldCriteriaDateRangeIn(dateRange);
    return (value: T_DataType) => {
        return !func(value);
    }
}

export function dbFieldCriteriaEqual(baseValue: T_DataType): F_DbFieldCriteria {
    return (value: T_DataType) => {
        return value === baseValue;
    }
}

