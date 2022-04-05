

import { StrNum, DataMap, DataValidationMap } from "./../Types" ;

function validate( dataMap: DataMap, validations: DataValidationMap, validators: Map<string, function> = new Map() ) {
    const cValidators : Map<string, function> = coreValidators() ;
    const paramKeys: string[] = validations.keys() ;
    for ( let pi = 0 ; pi < paramKeys.length ; pi++ ) {
        const param: string = paramKeys[pi] ;
        const paramValidations = validations.get( param ) ;
        for ( let vi = 0 ; vi < paramValidations.length ; vi++ ) {
            const validation: string = paramValidations[vi][0].toLowerCase() ;
            const arg1: StrNum = paramValidations[vi][1] ;
            const arg2: StrNum = paramValidations[vi][2] ;
            const validator = validators.get( validation ) || cValidators.get( validation ) ;
            if ( !validator ) {

                continue ;
            }
            validator.call( null, dataMap, param, arg1, arg2 ) ;
            switch ( validation ) {
                case "pattern":
                    const pattern: string = paramValidations[vi][0] ;

                    break ;
                default:

            }
        }
    }
}

function coreValidators() : Map<string, function> {
    const validators: Map<string, function> = new Map() ;
    validators.set( "pattern", validatePattern ) ;
    validators.set( "email", validateEmail ) ;
    validators.set( "numeric", validateNumeric ) ;
    validators.set( "alphanumeric", validateAlphaNumeric ) ;
    validators.set( "stringlength", validateStringLength ) ;
    validators.set( "numberrange", validateNumberRange ) ;
    validators.set( "daterange", validateDateRange ) ;
    // validators.set( "timerange", validateTimeRange ) ;
    return validators ;
}

function validatePattern( dataMap: DataMap, param: string, pattern: string ) {
    if ( args.length === 0 ) {
        throw `Argument for regex string "pattern" required.` ;
    }
    const value = dataMap.get( param ) ;
    const regex = new RegExp( pattern ) ;
    if ( !regex.test( value ) ) {
        throw `Parameter '${param}' with value '${value}' does NOT match pattern ${pattern}.` ;
    }
}
function validateEmail( dataMap: DataMap, param: string ) {
    validatePattern( dataMap, param, "[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,4}" ) ;
}
function validateNumeric( dataMap: DataMap, param: string ) {
    validatePattern( dataMap, param, "[0-9]+" ) ;
}
function validateAlphaNumeric( dataMap: DataMap, param: string ) {
    validatePattern( dataMap, param, "[A-Za-z0-9]+" ) ;
}

function validateRequired( dataMap: DataMap, param: string ) {
    const value = dataMap.get( param ) ;
    if ( !value ) {
        throw `Parameter '${param}' with value '${value}' is required.` ;
    }
}

function validateStringLength( dataMap: DataMap, param: string, minlen: number = undefined, maxlen: number = undefined ) {
    const str = dataMap.get( param ) ;
    if ( str && minlen && str.length < minlen ) {
        throw `String parameter '${param}' with value '${str}' minimum length ${minlen} - FAILED.` ;
    }
    if ( str && maxlen && str.length > maxlen ) {
        throw `String parameter '${param}' with value '${str}' maximum length ${maxlen} - FAILED.` ;
    }
}

function validateNumberRange( dataMap: DataMap, param: string, min: number = undefined, max: number = undefined ) {
    const num = dataMap.get( param ) ;
    if ( num && minlen && num < min ) {
        throw `String parameter '${param}' with value '${num}' minimum length ${min} - FAILED.` ;
    }
    if ( num && maxlen && num > max ) {
        throw `String parameter '${param}' with value '${num}' maximum length ${max} - FAILED.` ;
    }
}

function validateDateRange( dataMap: DataMap, param: string, before: number = undefined, after: number = undefined ) {
    const today = (new Date()).setHours( 0, 0, 0, 0 ) ;
    const date : number = dataMap.get( param ) ;
    const daysAfter: number = ( args && args.length > 1 ? args[1] : undefined ) ;
    const afterDate: number =  today + daysAfter*1000*3600*24 ;
    if ( date && before && date > ( today + before*24*3600000 ) ) {
        throw `Date parameter '${param}' with value '${new Date( date )}' before ${before} days to today - FAILED.` ;
    }
    if ( date && after && date < ( today + after*24*3600000 )  ) {
        throw `Date parameter '${param}' with value '${new Date( date ) }' after ${after} days to today - FAILED.` ;
    }
}

function validateTimeRange( dataMap: DataMap, param: string, after: number = undefined, before: number = undefined ) {
    const time : number = dataMap.get( param ) ;
    const daysAfter: number = ( args && args.length > 1 ? args[1] : undefined ) ;
    const afterDate: number =  today + daysAfter*1000*3600*24 ;
    if ( time && before && date > ( today + before*24*3600000 ) ) {
        throw `Date parameter '${param}' with value '${new Date( time )}' before ${before} days to today - FAILED.` ;
    }
    if ( time && after && date < ( today + after*24*3600000 )  ) {
        throw `Date parameter '${param}' with value '${new Date( time ) }' after ${after} days to today - FAILED.` ;
    }
}



/**
 * Abstract class to validate parameters.
 * Contains a single <code>validate</code> method.
 */
abstract class ParamValidator {
    
    /**
     * 
     * @param dataMap Map of parameter name and its value.
     * @param param Name of parameter.
     * @param args Any other arguments to pass into validation method.
     */
    abstract validate( dataMap: Map<string, StrNum>, param: string, ...args: StrNum[] ) ;

}

class PatternValidator extends ParamValidator {

    private Pattern: string ;

    constructor( pattern: string ) {
        this.Pattern = pattern ;
    }

    validate( dataMap: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        const value = dataMap.get( param ) ;
        const regex = new RegExp( this.Pattern ) ;
        if ( !regex.test( value ) ) {
            throw `Parameter '${param}' with value '${value}' does NOT match pattern ${this.Pattern}.` ;
        }
    }

}

class EmailValidator extends PatternValidator {

    constructor() {
        super( "[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,4}" ) ;
    }

}

class NumericValidator extends PatternValidator {

    constructor() {
        super( "[0-9]+" ) ;
    }

}

class AlphaNumericValidator extends PatternValidator {

    constructor() {
        super( "[A-Za-z0-9]+" ) ;
    }

}

class RequiredValidator extends ParamValidator {

    validate( dataMap: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        const value = dataMap.get( param ) ;
        if ( !value ) {
            throw `Parameter '${param}' with value '${value}' is required.` ;
        }
    }

}

/**
 * Validates string length if it exists.
 * For existance call the RequiredValidator
 */
class StringLengthValidator extends ParamValidator {

    /**
     * call method eg: validate( dataMap: Map<string, any>, param: string, minlen: number, maxlen: number ) 
     * @param minlen optional minimum length of string.
     * @param maxlen optional maximum length of string.
     */
    validate( dataMap: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        const str = dataMap.get( param ) ;
        const minlen: number = ( args && args.length > 0 ? args[0] : undefined ) ;
        const maxlen: number = ( args && args.length > 1 ? args[1] : undefined ) ;
        if ( str && minlen && str.length < minlen ) {
            throw `String parameter '${param}' with value '${str}' minimum length ${minlen} - FAILED.` ;
        }
        if ( str && maxlen && str.length > maxlen ) {
            throw `String parameter '${param}' with value '${str}' maximum length ${maxlen} - FAILED.` ;
        }
    }
    
}

class DateRangeValidator extends ParamValidator {

    /**
     * call method eg: validate( dataMap: Map<string, StrNum>, param: string, before: number, after: number )
     * @param before validate date is before (today+before) 
     * @param after validate date is after (today+after)
     */
    validate( dataMap: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        if ( args.length === 0 ) {
            throw `DateRangeValidator :: missing rest arguments.` ;
        }
        const today = (new Date()).setHours( 0, 0, 0, 0 ) ;
        const date : number = dataMap.get( param ) ;
        const daysBefore: number = args[0] ; // required
        const beforeDate: number = today + daysBefore*1000*3600*24 ;
        const daysAfter: number = ( args && args.length > 1 ? args[1] : undefined ) ;
        const afterDate: number =  today + daysAfter*1000*3600*24 ;
        if ( date && daysBefore && date > beforeDate ) {
            throw `Date parameter '${param}' with value '${new Date( date ) }' before ${daysBefore} (${new Date( beforeDate )}) - FAILED.` ;
        }
        if ( date && daysAfter && date < afterDate  ) {
            throw `Date parameter '${param}' with value '${new Date( date ) }' after ${daysAfter} (${new Date( afterDate )}) - FAILED.` ;
        }
    }
    
}

class TimeRangeValidator extends ParamValidator {

    /**
     * call method eg: validate( dataMap: Map<string, StrNum>, param: string, before: number, after: number )
     * @param before validate date is before (today+before) 
     * @param after validate date is after (today+after)
     */
    validate( dataMap: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        if ( args.length === 0 ) {
            throw `TimeRangeValidator :: missing rest arguments.` ;
        }
        const time : number = dataMap.get( param ) % ( 1000*3600*24 ) ;
        let before: number, after: number ;
        const hoursBefore: number = ( args && args.length > 0 ? args[0] : undefined ) ;
        if ( hoursBefore ) {
            const minutesBefore: number = ( args && args.length > 1 ? args[1] : 0 ) ;
            before = 1000*60*minutesBefore + 1000*60*60*hoursBefore ;
        }
        const hoursAfter: number = ( args && args.length > 2 ? args[2] : undefined ) ;
        if ( hoursAfter ) {
            const minutesAfter: number = ( args && args.length > 0 ? args[0] : 0 ) ;
            after = 1000*60*minutesAfter + 1000*60*60*hoursAfter ;
        }
        if ( time && before != undefined && time > before ) {
            throw `Time parameter '${param}' with value '${new Date( time ) }' NOT before (${new Date( before )}) - FAILED.` ;
        }
        if ( time && after && time < after  ) {
            throw `Date parameter '${param}' with value '${new Date( time ) }' NOT after (${new Date( after )}) - FAILED.` ;
        }
    }
    
}

class NumberRangeValidator extends ParamValidator {

    /**
     * call method eg: validate( dataMap: Map<string, StrNum>, param: string, min: number, max: number )
     * @param min validate date is before (today+before) 
     * @param max validate date is after (today+after)
     */
    validate( dataMap: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        if ( args.length === 0 ) {
            throw `NumberRangeValidator :: missing rest arguments.` ;
        }
        const num : number = dataMap.get( param ) ;
        const min: number = ( args && args.length > 0 ? args[0] : undefined ) ;
        const max: number = ( args && args.length > 1 ? args[1] : undefined ) ;
        if ( num && min != undefined && num < min ) {
            throw `Number parameter '${param}' with value '${num}' NOT >= ${min} - FAILED.` ;
        }
        if ( num && max != undefined && num > max ) {
            throw `Number parameter '${param}' with value '${num}' NOT <= ${max} - FAILED.` ;
        }
    }
    
}

// types
export { StrNum } ;
// abstract classes
export { ParamValidator } ;
//  classes that validate string patterns
export { PatternValidator, EmailValidator, NumericValidator, AlphaNumericValidator } ;
// classes that do general validation
export { RequiredValidator, StringLengthValidator, NumberRangeValidator, DateRangeValidator, Time } ;


