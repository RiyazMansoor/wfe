

/**
 * Guard function signature - to create this node 
 */
type NodeGuard = ( DataMap ) => GuardError ;


/**
 * Signaure of a data validator function
 * @DataMap
 * @string name of the parameter in the @DataMap
 * @StrNum option parameter to use in validation
 * @StrNum option parameter to use in validation
 */
type DataValidator = ( DataMap, string, StrNum?, StrNum? ) => string[] ;


