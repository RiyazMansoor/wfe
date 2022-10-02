/**
 * Common functions.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20221020
 */


import { T_IndId, T_Integer, T_Timestamp } from "./types";

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

/**
 * Identifies the executor (impersonated) and if the individuals access roles
 * are the supplied access role, then access is granted.
 * @see executingForId() 
 * @param roleKey Of role with access.
 * @returns true if executor has access.
 */
export function hasRole(roleKey: string): boolean {
    const individual = executingForId();
    // TODO : role module and match role key to callers roles.
    return false;
}


