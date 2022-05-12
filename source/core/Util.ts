
/**
 * Returns a random string in base 36.
 * @param len Length of the random string ( default = 24 ) to return
 */
function randomId( len: number = 24 ) : string {
    let id : string = "" ;
    while ( id.length < len ) {
        id += Math.random().toString( 36 ).substring( 2 ) ; 
    }
    return id.substring( 0, len ) ;
}

function timeString() : string {
    return new Date().toISOString().replace( /\D/g, "" ) ;
}

function NewInstanceId( len: number = 30 ) : string {
    let id: string = timeString() + "_" ;
    return id + randomId( len - id.length ) ;
}

function PrimitiveDeepCopy( from: object, to: object ) : void {
    for ( const prp in from ) {
        if ( prp in to || typeof from.prp != typeof from.to ) continue ;
        if ( typeof prp == 'object' ) {
            PrimitiveDeepCopy( from.prp, to.prp ) ;
        } else {
            to.prp = from.prp ;
        }
    }
}

export = {
    NewInstanceId,
    PrimitiveDeepCopy
}
