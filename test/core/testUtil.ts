
import StrNum from "./../../core/Types" ;
import randomId from "./../../core/Util" ;

function test_workflowId() {
    function executor( params: object ) : any {
        return randomId( params["len"] ) ;
    }
    const lens: number[] = [ 1, 7, 13, 19, 23, 29, 67 ] ;
    const inputs: object[] = lens.map( l => ( { "len": l } ) ) ;
    const outputs: object[] = inputs ;

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

