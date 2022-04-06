
/**
 * A type for data types used in this project JSON
 */
type StrNum = string | number ;
 
/**
 * Type for representing a data record.
 */ 
type DataMap = Map<string, StrNum> ;

 /**
  * A map of validations from param to array of validations (name of the validation and 2 optional arguments to pass)
  */
type DataValidationMap = Map<string, [ string, StrNum?, StrNum? ][]> ;

/**
 * Signaure of a data validator function
 */
type DataValidator = ( DataMap, string, StrNum?, StrNum? ) => string[] ;

/**
 * Map of data validation functions
 */
type DataValidatorMap = Map<string, function> 


export {
    StrNum, DataMap, DataValidation, DataValidator, DataValidationMap
}
