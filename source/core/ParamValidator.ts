

/**
 * Abstract class to validate parameters.
 * Contains a single <code>validate</code> method.
 */
abstract class ParamValidator {
    
    /**
     * 
     * @param params Map of parameter name and its value.
     * @param param Name of parameter.
     * @param args Any other arguments to pass into validation method.
     */
    abstract validate( params: Map<string, StrNum>, param: string, ...args: StrNum[] ) ;

}

class PatternValidator extends ParamValidator {

    private Pattern: string ;

    constructor( pattern: string ) {
        this.Pattern = pattern ;
    }

    validate( params: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        const value = params.get( param ) ;
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

    validate( params: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        const value = params.get( param ) ;
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
     * call method eg: validate( params: Map<string, any>, param: string, minlen: number, maxlen: number ) 
     * @param minlen optional minimum length of string.
     * @param maxlen optional maximum length of string.
     */
    validate( params: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        const str = params.get( param ) ;
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
     * call method eg: validate( params: Map<string, StrNum>, param: string, before: number, after: number )
     * @param before validate date is before (today+before) 
     * @param after validate date is after (today+after)
     */
    validate( params: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        if ( args.length === 0 ) {
            throw `DateRangeValidator :: missing rest arguments.` ;
        }
        const today = (new Date()).setHours( 0, 0, 0, 0 ) ;
        const date : number = params.get( param ) ;
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
     * call method eg: validate( params: Map<string, StrNum>, param: string, before: number, after: number )
     * @param before validate date is before (today+before) 
     * @param after validate date is after (today+after)
     */
    validate( params: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        if ( args.length === 0 ) {
            throw `TimeRangeValidator :: missing rest arguments.` ;
        }
        const time : number = params.get( param ) % ( 1000*3600*24 ) ;
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
     * call method eg: validate( params: Map<string, StrNum>, param: string, min: number, max: number )
     * @param min validate date is before (today+before) 
     * @param max validate date is after (today+after)
     */
    validate( params: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        if ( args.length === 0 ) {
            throw `NumberRangeValidator :: missing rest arguments.` ;
        }
        const num : number = params.get( param ) ;
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


