
import { TestResults, TestMethods } from "./../source/test/TestFramework" ;

import testUtilModule from "./core/testUtil" ;
import testParamValidatorModule from "./core/testParamValidator" ;

function testCoreModule() : TestMethods {
    const funcs = [ testUtilMethods ] ;
    return { moduleName: "core", funcs: funcs } ;
}


function testModuleTree( module: TestMethods ) : TestResult {
    const result: TestResult = { failed: 0, total: 0 } ;
    for ( let ti = 0 ; ti < module.funcs.length ; ti++ ) {
        const result1: TestMethods|TestResult = module.funcs[ti]() ;
        if ( result1 instanceof TestResult ) {
            result.failed += result1.failed ;
            result.total += result1.total ;
        } else {
            const result2 = testModuleTree( result1 ) ;
            result.failed += result2.failed ;
            result.total += result2.total ;
        }
    }
    return result ;
}

function testAll() {


}
