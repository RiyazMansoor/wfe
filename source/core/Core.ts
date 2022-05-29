

type Email = string ;
type DateTime = number ;
type Key = string ;
type Html = string ;

type DataType = string | number ;
type DataBlock = {
    [index: string]: DataType | DBlock
} ;
// type FormData = DataBlock ;

type flType = string ;
type flInstanceId = string ;
type NdType = string ;
type NdInstanceId = string ;

type Message = {
    type: "I"|"A"|"E",
    key: Key,
    message: Html
}

type BaseNd = {
    ndType: NdType,
    ndInstanceId: NdInstanceId,
    flType: flType,
    flInstanceId: flInstanceId,
    ndCreatedAt: DateTime,
    ndClosedAt: DateTime,
    nextNdType:  NdType,
    sflTypes: flType[],
} ;

type BaseFl = {
    flType: flType,
    flInstanceId: flInstanceId,
    flCreatedAt: DateTime,
    flClosedAt: DateTime,
    flData: DataBlock,
    pflType: flType,
    pflInstanceId: flInstanceId,
} ;


abstract class BaseNode {

    protected baseNd: BaseNd = {
        ndType: null,
        ndInstanceId: null,
        flType: flType,
        flInstanceId: flInstanceId,
        ndCreatedAt: Date.now(),
        ndClosedAt: 0,
        nextNdType: null,
        sflTypes: [],
    } ;

    // does not save this Nd
    constructor( baseFl: BaseFl, nextNdType: NdType, flTypes: flType[] = [] ) {
        super() ;
        const messages: Message[] = this.execPredicate( baseFl.flData ) ;
        if ( messages.length > 0 ) throw messages ;
        // all good - construct this node
        this.baseNd.ndType = this.constructor.name ;
        this.baseNd.ndInstanceId = NewInstanceId() ;
        this.baseNd.flType = baseFl.flType ;
        this.baseNd.flInstanceId = baseFl.flInstanceId ;
        this.baseNd.nextNdType = nextNdType ;
        this.baseNd.sflTypes = flTypes ;
    }

    constructor( serialized: { baseNd: BaseNd } ) {
        super() ;
        this.baseNd = serialized.baseNd ;
    }

    // default pass through predicate, else over ride
    protected execPredicate( flData: DataBlock ) : Message[] {
        return [] ; 
    }

    // default - no validation required / pass through - or throw Message[]
    abstract protected assertDataValid( ndData: DataBlock ) : void ;

    // this method must be over-ridden in Input Nodes 
    protected nextNdType( ndData: DataBlock ) : NdType {
        return this.baseNd.nextNdType ;
    }

    Submit( ndData: DataBlock ) : void {
        this.assertDataValid( ndData ) ;
        this.baseNd.ndClosedAt = Date.now() ;
        this.save() ;
        // create next node[s]
        const baseFlow: BaseFlow = FetchWf( this.baseNd.flType, this.baseNd.flInstanceId ) ;
        baseFlow.mergeData( ndData, this.baseNd ) ;
        const wfEnded: boolean = ( this.baseNd.nextNdType == null ) ;
        for ( const flType of this.baseNd.ndFlows ) {
            baseFlow.createFlow( flType, !wfEnded ) ;
        } 
        if ( nextNdType ) {
            baseFlow.createNode( this.nextNdType( ndData ) ).save() ;
        } else {
            baseFlow.close() ;
        }
        baseFlow.save() ;
    }

    save() : void {
        SaveNd( this.toJSON() ) ;
    }

    toJSON() : { baseNd: BaseNd } {
        return { baseNd: this.baseNd } ;
    }

    toString() : string {
        return JSON.stringify( toJSON(), null, 2 ) ;
    }    

}

abstract class BaseFlow {

    protected baseFl: BaseFl = {
        flType = null,
        flInstanceId = null,
        flCreatedAt = Date.now(),
        flClosedAt = 0,
        flData = null,
        pflType = null,
        pflInstanceId = null,
    } ;

    constructor( startData: DataBlock, parentBaseFl: BaseFl = null ) {
        super() ;
        const messages: Message[] = this.execPredicate( startData ) ;
        if ( messages.length > 0 ) throw messages ;
        // all ok, construct workflow
        this.baseFl.flType = this.constructor.name ;
        this.baseFl.flInstanceId = NewInstanceId() ;
        if ( pflBaseFl ) {
            this.baseFl.pflType = parentBaseFl.pflType ;
            this.baseFl.pflInstanceId = parentBaseFl.pflInstanceId ;
        }
        this.mergeData( startData, null ) ;
    }

    constructor( serialized: { baseFl: BaseFl } ) {
        super() ;
        this.baseFl = serialized.baseFl ;
    }

    // default pass through predicate, else over ride
    execPredicate( startData: DataBlock ) : Message[] {
        return [] ; 
    }

    // default - no data merge is required
    abstract mergeData( ndData: DataBlock, baseNd: BaseNd ) : void ;

    abstract createNode( ndType: NdType ) : BaseNode ;

    abstract createFlow( flType: flType, isSubFlow: boolean = true ) : void ;

    backFlow( childBaseFl: BaseFl ) : void {
        // default - no sub flows to handle.
    }

    close() {
        this.baseFl.flClosedAt = Date.now() ;
        if ( this.baseFl.pflType ) {
            const pbaseFlow: BaseFlow = FetchWf( this.baseFl.pflType, this.baseFl.pflInstanceId ) ;
            pbaseFlow.backFlow( this.baseFl ) ;
            pbaseFlow.save() ;
        }
    }

    save() : void {
        SaveWf( this.toJSON() ) ;
    }

    toJSON() : { baseFl: BaseFl } {
        return { baseFl: this.baseFl } ;
    }

    toString() : string {
        return JSON.stringify( toJSON(), null, 2 ) ;
    }

}













type EfaasUsername = string ;
type AuthRole = string ;
type HoursSLA = number ; 

type BaseInputNd = {
    ndHoursSLA: HoursSLA,
    ndDeadlineSLA: DateTime,
    ndAuthRole: AuthRole,
    ndStaffUser: EfaasUsername,
    ndStatus: NodeStatus,
    ndEditData: Key[],
}

enum InputNodeStatus { Waiting, Ready, Started, Ended }



abstract class BaseInputNode extends BaseNode {

    protected baseInputNd: BaseInputNd = {
        ndHoursSLA: null,
        ndDeadlineSLA: null,
        ndAuthRole: null,
        ndStaffUser: null,
        ndStatus: NodeStatus.Ready,
        // ndEditData: [],
    }

    constructor( baseFl: BaseFl, nextNdType: NdType, flTypes: flType[] = [], hoursSLA: HoursSLA, authRole: AuthRole ) {
        super( baseFl, nextNdType, flTypes ) ;
        this.baseInputNd.ndHoursSLA = hoursSLA ;
        this.baseInputNd.ndDeadlineSLA = AddWorkingHours( hoursSLA ) ;
        this.baseInputNd.ndAuthRole = authRole ;
    }

    constructor( serialized: { baseInputNd: BaseInputNd } ) {
        super( serialized ) ;
        this.baseInputNd = serialized.baseInputNd ;
    }

    protected assertIsAuthorised( staff: EfaasUsername ) : void {
        if ( !StaffInAuthRole( staff, this.baseInputNd.ndAuthRole ) ) {
            throw `Node type=${this.baseNd.ndType} instance=${this.baseNd.ndInstanceId} :: Staff=${staff} NOT in authorized role=${this.baseInputNd.ndAuthRole}` ;
        }
    }
    
    protected assertCorrectStatus( expectedStatus: InputNodeStatus ) : void {
        if ( this.baseInputNd.ndStatus != expectedStatus ) {
            throw `Node type=${this.baseNd.ndType} instance=${this.baseNd.ndInstanceId} :: status=(expected=${expectedStatus}, actual=${this.baseInputNd.ndStatus}).` ;
        }
    }

    protected assertSameUser( staff: EfaasUsername ) : void {
        if ( this.baseInputNd.ndStaffUser != staff ) {
            throw `Node type=${this.baseNd.ndType} instance=${this.baseNd.ndInstanceId} :: staff=(expected=${this.baseInputNd.ndStaffUser}, actual=${staff}).` ;
        }
    }

    Start( staff: EfaasUsername ) : void {
        this.assertIsAuthorised( staff ) ;
        this.assertCorrectStatus( InputNodeStatus.Ready ) ;
        this.baseInputNd.ndStatus = InputNodeStatus.Started ;
        this.baseInputNd.ndStaffUser = staff ;
        this.save() ;
    }

    Return( staff: EfaasUsername ) : void {
        this.assertIsAuthorised( staff ) ;
        this.assertSameUser( staff ) ;
        this.assertCorrectStatus( InputNodeStatus.Started ) ;
        this.baseInputNd.ndStatus = null ;
        this.baseInputNd.ndStatus = InputNodeStatus.Ready ;
        this.save() ;
    }


    Submit( ndData: DataBlock, staff: EfaasUsername ) : void {
        this.assertIsAuthorised( staff ) ;
        this.assertSameUser( staff ) ;
        this.assertCorrectStatus( InputNodeStatus.Started ) ;
        super.Submit( ndData ) ;
    }


    toJSON() : { inputBaseNd: InputBaseNd } {
        const obj = super.toJSON() ;
        obj.baseInputNd = this.baseInputNd ;
        return obj ;
    }

}

enum InputNodeAction { Submit, Review, Reject, Approve, UserResubmit } ;
enum Validation { Required, StringLength }
type Input = {
    key: string,
    value: DataType,
    default: DataType,
    label: string,
    tip: Html,
    required: boolean,
    validations: Validation[],
}

enum InputWidth { Quarter, Half, ThreeQuarter, Third, TwoThird, Rest }
type InputRow = [
    { width: InputWidth, input: Input }
]
type InputForm = {
    title: string,
    inputrows: InputRow[],
    actions: Actions[]
}

abstract class BaseFormInputNode extends BaseInputNode {

    protected baseFormInputNd: BaseFormInputNd = {
        // ndEditData: [],
    }

    constructor( baseFl: BaseFl, nextNdType: NdType, flTypes: flType[] = [], hoursSLA: HoursSLA, authRole: AuthRole ) {
        super( baseFl, nextNdType, flTypes, hoursSla, authRole ) ;
    }

    constructor( serialized: { baseFormInputNd: BaseFormInputNd } ) {
        super( serialized ) ;
        this.baseFormInputNd = serialized.baseFormInputNd ;
    }

    toJSON() : { baseFormInputNd: BaseFormInputNd } {
        const obj = super.toJSON() ;
        obj.baseFormInputNd = this.baseFormInputNd ;
        return obj ;
    }

}






// static functions

// TODO
function CreateWorkflow( flType: flType, wfStartData: DataBlock, parentBaseFl: BaseFl = null ) : BaseFlow {
    switch ( flType ) {
        case "DocumentVerficationWorkflow": 
            return new DocumentVerificationWorkflow( wfStartData, parentBaseFl ) ; 
    }
    throw `function CreateWorkflow :: unknown wfClass "${flType}` ;
}

// TODO
function FetchNd( ndType: ndType, ndInstanceId: ndInstanceId ) : BaseNode {
    return null ;
}

// TODO
function SaveNd( ndObject: { baseNd: BaseNd } ) : void {

}

// TODO
function FetchWf( flType: flType, flInstanceId: flInstanceId ) : BaseFlow {
    return null ;
}

// TODO
function SaveWf( baseFl: BaseFl ) : void {

}

// TODO
function AddWorkingHours( hoursSLA: HoursSLA ) : DateTime {
    return Date.now() + 1000 * 60 * 5 ;
}

// TODO
function StaffInAuthRole( staff: EfaasUsername, authRole: AuthRole ) : boolean {
    return true ;
}

function NewInstanceId( len: number = 30 ) : string {
    let id: string = new Date().toISOString().replace( /\D/g, "" ) + "_" ;
    while ( id.length < len ) {
        id += Math.random().toString( 36 ).substring( 2 ) ; 
    }
    return id.substring( 0, len ) ;
}


