
/**
 * A type for data types used in this project JSON
 */
type StrNum = string | number ;
 
// types related to data validation

/**
 * Type for representing a data record - parameter name -> parameter value.
 */ 
type DataMap = Map<string, StrNum> ;

/**
 * Signaure of a data validator function
 * @DataMap
 * @string name of the parameter in the @DataMap
 * @StrNum option parameter to use in validation
 * @StrNum option parameter to use in validation
 */
 type DataValidator = ( DataMap, string, StrNum?, StrNum? ) => string[] ;

 /**
  * A map of validations from param to array of validations (name of the validation and 2 optional arguments to pass)
  */
type DataValidationMap = Map<string, [ string, StrNum?, StrNum? ][]> ;


/**
 * Map of data validation functions
 */
type DataValidatorMap = Map<string, function> 

type DataValidate = ( dataMap: DataMap, validations: DataValidationMap, validators: DataValidatorMap ) => string[] ;


export {
    StrNum, DataMap, DataValidation, DataValidator, DataValidationMap
}
