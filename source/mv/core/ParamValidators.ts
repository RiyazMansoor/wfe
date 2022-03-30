


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
