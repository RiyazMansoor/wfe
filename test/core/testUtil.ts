
import StrNum from "./../../core/Types" ;
import randomId from "./../../core/Util" ;
import testExecute from "./../testCore" ;

function testRandomId() {
    const lens: number[] = [ 1, 7, 13, 19, 23, 29, 67 ] ;
    function tester( testIndex: number ) : boolean {
        const randomStr: string = randomId( lens[testIndex] ) ;
        return ( randomStr.length == lens[testIndex] ) ;
    }
    const failures: number[] = testExecute( [], tester) ;
    for ( let fi = 0 ; fi < failures.length ; fi++ ) {
        const testIndex = failures[fi] ;
        console.error( `testRandomId FAILED :: passed( ${lens[testIndex]} ) ` ) ;
    }
}
test_workflowId() ;

