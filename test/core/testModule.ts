
import testUtil from "./core/testUtil" ;
import testParamValidators from "./core/testParamValidators" ;

function testCoreModule() : TestMethods {
    const funcs = [ testUtilMethods, testParamValidators ] ;
    return { moduleName: "/core", funcs: funcs } ;
}

