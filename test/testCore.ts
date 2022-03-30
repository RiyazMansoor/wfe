
import StrNum from "./../../core/ParamValidator" ;

type TestExecutor = ( inputs: StrNum[] ) => any ;
type TestVerifier = ( result: any ) => boolean ;
type TestFailures = { inputs: StrNum[], expected: any, actual: any }

// TODO
function execute( inputs: StrNum[][], exceptions: boolean[], fnExe: TestExecutor, fnVer: TestVerifier ) : TestFailures[] {
    let failures: TestFailures[] = [] ;
    for ( let i = 0 ; i < inputs.length ; i++ ) {
        const failure = { "inputs":inputs[i], "expected":results[i] } ;
        try {
            const result = fnExecuter.execute( inputs[i] ) ;
            if ( !fnResult.verify( result, results[i] ) ) {
                failure[ "actual" ] = result ;
                failures.push( failure ) ;
            }
        } catch ( e ) {
            if ( !exceptions[i] ) {
                failure[ "actual" ] = e ;
                failures.push( failure ) ;
            }
        }
    }
    return failures ;
}


