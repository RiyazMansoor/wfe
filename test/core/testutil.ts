

function test_workflowId() {
    const lens: number[] = [ 7, 13, 19, 23, 29 ] ;
    let errors : string[] = [] ;
    for ( let i = 0 ; i < lens.length ; i++ ) {
        const randomStr = core.util.workflowId( lens[i] ) ;
        if ( lens[i] != randomStr.length ) {
            errors.push( `test_workflowId :: FAILED :: arguments(len=${len[i]}) returned(${randomStr})` ) ;
        }
    }
    errors.forEach( err => console.error( err ) ) ;
}
test_workflowId() ;

