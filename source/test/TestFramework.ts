
import { TestResult, TestRunner, TestFunctions } from "./../Types" ;


function testExecute( methodName: string, exceptions: boolean[], fnRunner: TestRunner ) : TestResult {
    const failures: number[] = [] ;
    for ( let testIndex = 0 ; testIndex < exceptions.length ; testIndex++ ) {
        try {
            const isCorrect = fnRunner( testIndex ) ;
            // if exception is expected or incorrect result
            if ( exceptions[testIndex] || !isCorrect ) {
                failures.push( testIndex ) ;
                console.error( `    Method "${methodame}", test ${testIndex} FAILED :: did NOT throw expected exception.` ) ;
            } else if ( !isCorrect ) {
                failures.push( testIndex ) ;
                console.error( `    Method "${methodame}", test ${testIndex} FAILED :: results incorrect.` ) ;
            }
        } catch ( e ) {
            // if no expection is expected.
            if ( !exceptions[i] ) {
                failures.push( testIndex ) ;
                console.error( `    Method "${methodame}", test ${testIndex} FAILED :: threw unexpected exception.` ) ;
            }
        }
    }
    return { failed: failures.length, total: exceptions.length } ;
}

function testModuleTree( module: TestFunctions ) : TestResult {
    const result: TestResult = { failed: 0, total: 0 } ;
    for ( let ti = 0 ; ti < module.funcs.length ; ti++ ) {
        const result1: TestFunctions|TestResult = module.funcs[ti]() ;
        if ( result1 instanceof TestResult ) {
            result.failed += result1.failed ;
            result.total += result1.total ;
        } else {
            const result2 = testModuleTree( result1 ) ;
            result.failed += result2.failed ;
            result.total += result2.total ;
            if ( result2.failed == 0 ) {
                console.info( `Module "${result1.moduleName}" :: all ${result2.total} tests completed successfully.` ) ;
            } else {
                console.error( `Module "${result1.moduleName}" :: ${result2.failed}/${result2.total} tests FAILED.` ) ;
            }
        }
    }
    return result ;
}

function testRootModules( funcs: functions[] ) : TestResult {
    const root: TestFunctions = { moduleName: "/", funcs: funcs } ;
    return testModuleTree( root ) ;
}

export { 
    testExecute, testRootModules 
}
