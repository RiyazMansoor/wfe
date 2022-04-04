
import { TestResult, TestRunner } from "./../Types" ;



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

function testModule( moduleName: string, ...funcs: function[] ) : TestResult {
    const result: TestResult = { failed: 0, total: 0 } ;
    for ( let fi = 0 ; fi < functions.length; fi++ ) {
        const fiResult: TestResult = funcs[fi]() ;
        result.failed += fiResult.failed ;
        result.total += fiResult.total ;
    }
    if ( result.failed == 0 ) {
        console.info( `  Module "${moduleName}" :: all ${result.total} tests completed successfully.` ) ;
    } else {
        console.error( `  Module "${moduleName}" :: ${result.failed}/${result.total} tests FAILED.` ) ;
    }
    return result ;
}

function testModules( appName: string,  ...funcs: function[] ) : void {
    const result: TestResult = { failed: 0, total: 0 } ;
    for ( let fi = 0 ; fi < functions.length; fi++ ) {
        const fiResult: TestResult = funcs[fi]() ;
        result.failed += fiResult.failed ;
        result.total += fiResult.total ;
    }
    if ( result.failed == 0 ) {
        console.info( `App "${appName}" :: all ${result.total} tests completed successfully.` ) ;
    } else {
        console.error( `App "${appName}" :: ${result.failed}/${result.total} tests FAILED.` ) ;
    }
}

