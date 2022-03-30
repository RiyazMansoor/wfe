/**
 * Returns a random string in base 36.
 * @param len Length of the random string ( default = 24 ) to return
 */
function randomId( len: number = 24 ) : String {
    let id : string = "" ;
    while ( id.length < len ) {
        id += Math.random().toString( 36 ).substring( 2 ) ; 
    }
    return id.substring( 0, len ) ;
}
