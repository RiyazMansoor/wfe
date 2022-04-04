
// the result of a function under testing
type TestResult = { failed: number, total: number } ;

// wrapper that well execute the test function
type TestRunner = ( testIndex: number ) => boolean ;

// test functions contained in the module
type TestFunctions = { moduleName: string, funcs: function[] } ;


export {
    TestResult, TestRunner, TestFunctions
}
