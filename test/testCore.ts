
import { TestResult, TestRunner } from "./../Types" ;



function testExecute( exceptions: boolean[], fnRunner: TestRunner ) : number[] {
    const failures: number[] = [] ;
    for ( let testIndex = 0 ; testIndex < exceptions.length ; testIndex++ ) {
        try {
            const isCorrect = fnRunner( testIndex ) ;
            // if exception is expected or incorrect result
            if ( exceptions[testIndex] || !isCorrect ) {
                failures.push( testIndex ) ;
            }
        } catch ( e ) {
            // if no expection is expected.
            if ( !exceptions[i] ) {
                failures.push( testIndex ) ;
            }
        }
    }
    return failures ;
}

function testModule( moduleName: string, ...funcs: function[] ) : TestResult {
    const result: TestResult = { failed: 0, total: 0 } ;
    console.info( `Testing module "${moduleName}".` ) ;
    for ( let fi = 0 ; fi < functions.length; fi++ ) {
        const fiResult: TestResult = funcs[fi]() ;
        result.failed += fiResult.failed ;
        result.total += fiResult.total ;
    }
    if ( result.failed == 0 ) {
        console.info( `  Module "${moduleName}" - all ${result.total} tests completed successfully.`)
    } else {
        console.error( `  Module "${moduleName}" -  ${result.failed}/${result.total} tests FAILED.`)
    }
    return result ;
}

