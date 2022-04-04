
import randomId from "./../../core/Util" ;

import { TestResult, TestRunner, TestMethods } from "./../Types" ;
import { testExecute, testModule } from "./../testCore" ;

function testRandomId() {
    const lens: number[] = [ 1, 7, 13, 19, 23, 29, 67 ] ;
    function tester( testIndex: number ) : boolean {
        const randomStr: string = randomId( lens[testIndex] ) ;
        return ( randomStr.length == lens[testIndex] ) ;
    }
    const exception: boolean[] = lens.map( l => false ) ;
    return testExecute( "core.Util.randomId", exceptions, tester ) ;
}

function testUtilMethods() : TestMethods {
    const funcs = [ testRandomId ] ;
    return { moduleName: "core.Util", funcs: funcs } ;
}

