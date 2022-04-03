
// 
type TestResult = { failed: number, total: number } ;

// function that well execute the test method
type TestRunner = ( testIndex: number ) => boolean ;
