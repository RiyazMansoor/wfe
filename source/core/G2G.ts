

class HasAPI extends IfNode {

    constructor() {
        super() ;
        const pIf: Predicate = ( wfData: DBlock ) => wfData.url && wfData.key ;
        const pElse: Predicate = ( wfData: DBlock ) => true ;
        this.routes.push( [ pIf,   "", "xxx" ] ) ;
        this.routes.push( [ pElse, "", "yyy" ] ) ;
    }

}

