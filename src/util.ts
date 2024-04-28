/**
 * Common utility functions.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20221020
 * @modified 20240423, riyaz.mansoor@gmail.com
 */


import { T_Integer, T_Timestamp } from "./types";

/**
 * Returns a random alphanumeric string of supplied length.
 * By default, returns a random string of length 64.
 * @param length The length of the random string.
 * @return The random alphanumeric string.
 */
export function getRandomString(length: T_Integer = 64): string {
    let id: string = "";
    while (id.length < length) {
        id += Math.random().toString(36).substring(2);
    }
    return id.substring(0, length);
}

/**
 * Returns the timestamp for the supplied date object.
 * By default, returns the timestamp of the current date and time.
 * @param datetime The date object to convert to T_Timestamp.
 * @returns The timestamp for the supplied date object.
 */
export function getTimestamp(datetime: Date = new Date()): T_Timestamp {
    return datetime.toISOString();
}

