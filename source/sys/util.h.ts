/**
 * Common functions.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20220920
 */


import { T_Integer, T_Timestamp  } from "./types.h" ;

/**
 * Returns a random alphanumeric string of supplied length.
 * @param length The length of the random string.
 * @return The random alphanumeric string.
 */
export function randomString( length: T_Integer = 64 ) : string {
    let id: string = "" ;
    while ( id.length < length ) {
        id += Math.random().toString( 36 ).substring( 2 ) ; 
    }
    return id.substring( 0, length ) ;
}

/**
 * Returns the timestamp for the supplied date object.
 * @param datetime The date object to convert to T_Timestamp.
 * @returns The timestamp for the supplied date object.
 */
export function timestamp( datetime: Date = new Date() ) : T_Timestamp {
    return datetime.toISOString() ;
}



