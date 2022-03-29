

/**
 * A type for data types used in JSON
 */
type StrNum = string | number ;

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
            throw `Parameter '${param}' with value '${value}' does NOT match patter ${this.Pattern}.` ;
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
        super( "[a-z0-9]+" ) ;
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
class StringValidator extends ParamValidator {

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

class DateValidator extends ParamValidator {

    /**
     * call method eg: validate( params: Map<string, StrNum>, param: string, before: number, after: number )
     * @param before validate date is before (today+before) 
     * @param after validate date is after (today+after)
     */
    validate( params: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        if ( args.length === 0 ) {
            throw `DateValidator :: missing rest arguments.` ;
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

class PhoneValidator extends ParamValidator {

    static Pattern : string = "[0-9]{7}" ;

    validate( params: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        const phone: string = params.get( param ) ;
        const regex: RegExp = new RegExp( Pattern ) ;
        if ( phone && !regex.test( phone ) ) {
            throw `Phone parameter '${param}' with value '${phone}' pattern match (0000000) - FAILED.` ;
        }
    }
    
}

class NicValidator extends ParamValidator {

    static Pattern : string = "A[0-9]{6}" ;

    validate( params: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        const nic: string = params.get( param ) ;
        const regex: RegExp = new RegExp( Pattern ) ;
        if ( nic && !regex.test( nic ) ) {
            throw `NIC parameter '${param}' with value '${nic}' pattern match (A000000) - FAILED.` ;
        }
    }
    
}

class PassportValidator extends ParamValidator {

    static Pattern : string = "[0-9A-Z]{9}" ;

    validate( params: Map<string, StrNum>, param: string, ...args: StrNum[] ) {
        const passport: string = params.get( param ) ;
        const regex: RegExp = new RegExp( Pattern ) ;
        if ( passport && !regex.test( passport ) ) {
            throw `NIC parameter '${param}' with value '${passport}' pattern match (9 AlphaNum) - FAILED.` ;
        }
    }
    
}
