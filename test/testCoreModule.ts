
import { testRootModules } from "./../source/test/TestFramework" ;

import { testModule as testCoreModule } from "./core/testModule" ;


function testAll() {
    const modules: function[] = [ testCoreModule ] ;
    testRootModules( modules ) ;
}
