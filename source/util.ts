/**
 * Returns a random string in base 36.
 * @param len Length of the random string ( default = 24 ) to return
 */
export function randomId( len: number = 24 ) : string {
    let id : string = "" ;
    while ( id.length < len ) {
        id += Math.random().toString( 36 ).substring( 2 ) ; 
    }
    return id.substring( 0, len ) ;
}

export function timeString() : string {
    return new Date().toISOString().replace( /\D/g, "" ) ;
}
