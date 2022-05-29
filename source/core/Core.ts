

type Email = string ;
type DateTime = number ;
type Key = string ;
type Html = string ;

type DataType = string | number ;
type DataBlock = {
    [index: string]: DataType | DBlock
} ;
// type FormData = DataBlock ;

type WfType = string ;
type WfInstanceId = string ;
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
    wfType: WfType,
    wfInstanceId: WfInstanceId,
    ndCreatedAt: DateTime,
    ndClosedAt: DateTime,
    ndDefAction:  NdType,
    ndFlows: WfType[],
} ;

type BaseWf = {
    wfType: WfType,
    wfInstanceId: WfInstanceId,
    wfCreatedAt: DateTime,
    wfClosedAt: DateTime,
    wfData: DataBlock,
    pwfType: WfType,
    pwfInstanceId: WfInstanceId,
} ;


abstract class BaseNode {

    protected baseNd: BaseNd = {
        ndType: null,
        ndInstanceId: null,
        wfType: WfType,
        wfInstanceId: WfInstanceId,
        ndCreatedAt: Date.now(),
        ndClosedAt: 0,
        ndDefAction: null,
        ndFlows: [],
    } ;

    // does not save this Nd
    constructor( baseWf: BaseWf, defAction: NdType, flows: WfType[] = [] ) {
        super() ;
        const messages: Message[] = this.execPredicate( baseWf.wfData ) ;
        if ( messages.length > 0 ) throw messages ;
        // all good - construct this node
        this.baseNd.NdType = this.constructor.name ;
        this.baseNd.NdInstanceId = NewInstanceId() ;
        this.baseNd.wfType = baseWf.wfType ;
        this.baseNd.wfInstanceId = baseWf.wfInstanceId ;
        this.baseNd.ndDefAction = defAction ;
        this.baseNd.ndFlows = flows ;
    }

    constructor( serialized: { baseNd: BaseNd } ) {
        super() ;
        this.baseNd = serialized.baseNd ;
    }

    // default pass through predicate, else over ride
    protected execPredicate( wfData: DataBlock ) : Message[] {
        return [] ; 
    }

    // default - no validation required / pass through
    protected validateSubmission( ndData: DataBlock ) : Message[] {
        return [] ; 
    }

    abstract protected nextNodeType( ndData: DataBlock ) : NdType ;

    Submit( ndData: DataBlock ) : void {
        const messages: Message[] = this.validateSubmission( ndData ) ;
        if ( messages.length > 0 ) throw messages ;
        // create next node[s]
        const baseFlow: BaseFlow = FetchWf( this.baseNd.wfType, this.baseNd.wfInstanceId ) ;
        baseFlow.mergeData( ndData, this.baseNd ) ;
        const baseWf: BaseWf =  baseFlow.toJSON().baseWf ;
        const nextNdType: NdType = this.nextNodeType( ndData ) ;
        if ( nextNdType ) {
            baseFlow.createNode( ndType ).save() ;
            for ( const wfType of this.baseNd.ndFlows ) {
                CreateWorkflow( wfType, baseWf.wfData, baseWf ) ;
            } 
        } else {
            for ( const wfType of this.baseNd.ndFlows ) {
                CreateWorkflow( wfType, baseWf.wfData ) ;                
            } 
            baseFlow.close() ;
        }
        this.baseNd.ndClosedAt = Date.now() ;
        this.save() ;
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

    protected baseWf: BaseWf = {
        wfType = null,
        wfInstanceId = null,
        wfCreatedAt = Date.now(),
        wfClosedAt = 0,
        wfData = null,
        pwfType = null,
        pwfInstanceId = null,
    } ;

    constructor( startData: DataBlock, pwfBaseWf: BaseWf = null ) {
        super() ;
        const messages: Message[] = this.execPredicate( startData ) ;
        if ( messages.length > 0 ) throw messages ;
        // all ok, construct workflow
        this.baseWf.wfType = this.constructor.name ;
        this.baseWf.wfInstanceId = NewInstanceId() ;
        if ( pwfBaseWf ) {
            this.baseWf.pwfType = pwfBaseWf.pwfType ;
            this.baseWf.pwfInstanceId = pwfBaseWf.pwfInstanceId ;
        }
        this.init( startData ) ;
    }

    constructor( serialized: { baseWf: BaseWf } ) {
        super() ;
        this.baseWf = serialized.baseWf ;
    }

    // default pass through predicate, else over ride
    execPredicate( startData: DataBlock ) : Message[] {
        return [] ; 
    }

    abstract init( startData: DataBlock ) : void ;

    // default - no data merge is required
    abstract mergeData( ndData: DataBlock, baseNd: BaseNd ) : void ;

    abstract createNode( ndType: NdType ) : BaseNode ;

    updateFromSubFlow( baseWf: BaseWf ) : void {
        // default - no sub flows to handle.
    }

    close() {
        this.baseWf.wfClosedAt = Date.now() ;
        if ( this.baseWf.pwfType ) {
            const pbaseFlow: BaseFlow = FetchWf( this.baseWf.pwfType, this.baseWf.pwfInstanceId ) ;
            pbaseFlow.updateFromSubFlow( this.baseWf ) ;
            pbaseFlow.save() ;
        }
    }

    save() : void {
        SaveWf( this.toJSON() ) ;
    }

    toJSON() : { baseWf: BaseWf } {
        return { baseWf: this.baseWf } ;
    }

    toString() : string {
        return JSON.stringify( toJSON(), null, 2 ) ;
    }

}













type EfaasUsername = string ;
type StaffRole = string ;
type HoursSLA = number ; 

type BaseInputNd = {
    ndHoursSLA: HoursSLA,
    ndDeadlineSLA: DateTime,
    ndStaffRole: StaffRole,
    ndStaffUser: EfaasUsername,
    ndStatus: NodeStatus,
    ndEditData: Key[],
}

enum InputNodeAction { Submit, Review, Reject, Approve, UserResubmit } ;
enum InputNodeStatus { Waiting, Ready, Started, Ended }

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



abstract class BaseInputNode extends BaseNode {

    protected baseInputNd: BaseInputNd = {
        ndHoursSLA: null,
        ndDeadlineSLA: null,
        ndStaffRole: null,
        ndStaffUser: null,
        ndStatus: NodeStatus.Ready,
        ndEditData: [],
    }

    constructor( hoursSLA: HoursSLA, staffRole: StaffRole ) {
        super() ;
        this.baseInputNd.ndHoursSLA = hoursSLA ;
        this.baseInputNd.ndDeadlineSLA = AddWorkingHours( hoursSLA ) ;
        this.baseInputNd.ndStaffRole = staffRole ;
    }

    constructor( serialized: { baseInputNd: BaseInputNd } ) {
        super() ;
        this.baseInputNd = serialized.baseInputNd ;
    }

    protected AssertIsAuthorised( user: EfaasUsername ) : void {
        if ( !StaffInRole( user, this.baseInputNd.ndStaffRole ) ) {
            throw `Node type=${this.baseNd.ndType} instance=${this.baseNd.ndInstanceId} :: Staff=${user} NOT in authorized role=${this.baseInputNd.ndStaffRole}` ;
        }
    }
    
    protected AssertCorrectStatus( expectedStatus: InputNodeStatus ) : void {
        if ( this.baseInputNd.ndStatus != expectedStatus ) {
            throw `Node type=${this.baseNd.ndType} instance=${this.baseNd.ndInstanceId} :: status=(expected=${expectedStatus}, actual=${this.baseInputNd.ndStatus}).` ;
        }
    }

    protected AssertSameUser( user: EfaasUsername ) : void {
        if ( this.baseInputNd.ndStaffUser != user ) {
            throw `Node type=${this.baseNd.ndType} instance=${this.baseNd.ndInstanceId} :: staff=(expected=${this.baseInputNd.ndStaffUser}, actual=${user}).` ;
        }
    }

    public Start( user: EfaasUsername ) : void {
        this.AssertIsAuthorised( user ) ;
        this.AssertCorrectStatus( InputNodeStatus.Ready ) ;
        this.baseInputNd.ndStatus = InputNodeStatus.Started ;
        this.baseInputNd.ndStaffUser = user ;
        this.save() ;
    }

    public Return( user: EfaasUsername ) : void {
        this.AssertIsAuthorised( user ) ;
        this.AssertSameUser( user ) ;
        this.AssertCorrectStatus( InputNodeStatus.Started ) ;
        this.baseInputNd.ndStatus = null ;
        this.baseInputNd.ndStatus = InputNodeStatus.Ready ;
        this.save() ;
    }


    /**
     * 
     * @param wfData current workflow data.
     * @throws array of validation exceptions.
     */
    public Submit( wfData: DBlock, user: string ) : void {
        if ( this.ndUser != user ) {
            throw `Node type=${this.ndName} instance=${this.ndInstanceId} staff=${this.ndUser} already working.` ;
        }
        this.Validate( wfData ) ; // can throw validation exceptions
        // create next nodes.
        this.ndEndedAt = Date.now() ;
        this.ndStatus = NodeStatus.ENDED ;
    }


    toJSON() : { inputBaseNd: InputBaseNd } {
        const obj = super.toJSON() ;
        obj.baseInputNd = this.baseInputNd ;
        return obj ;
    }

}






abstract class IfNode extends Node {

    protected routes: PredicatePath[] = [] ;

    constructor() {
        super() ;
    }

    protected CreateNext( wfData: DBlock ) : boolean {
        let result: boolean = false ;
        for ( const pp of routes ) {
            if ( pp( wfData ) ) {
                // create node ; 
                // create new workflow ;
                result = true ;
                break ;
            }
        }
        return result ;
    }

}

abstract class BranchOutNode extends Node {

    protected routes: PredicatePath[] = [] ;

    constructor() {
        super() ;
    }

    protected CreateNext( wfData: DBlock ) : boolean {
        let result: boolean = false ;
        for ( const pp of routes ) {
            if ( pp( wfData ) ) {
                // create node ; 
                // create new workflow ;
                result = true ;
            }
        }
        return result ;
    }

}


// static functions

// TODO
function CreateWorkflow( wfType: WfType, wfStartData: DataBlock, parentBaseWf: BaseWf = null ) : BaseFlow {
    switch ( wfType ) {
        case "DocumentVerficationWorkflow": 
            return new DocumentVerificationWorkflow( wfStartData, parentBaseWf ) ; 
    }
    throw `function CreateWorkflow :: unknown wfClass "${wfType}` ;
}

// TODO
function FetchNd( ndType: ndType, ndInstanceId: ndInstanceId ) : BaseNode {
    return null ;
}

// TODO
function SaveNd( ndObject: { baseNd: BaseNd } ) : void {

}

// TODO
function FetchWf( wfType: WfType, wfInstanceId: WfInstanceId ) : BaseFlow {
    return null ;
}

// TODO
function SaveWf( baseWf: BaseWf ) : void {

}

// TODO
function AddWorkingHours( hoursSLA: HoursSLA ) : DateTime {
    return Date.now() + 1000 * 60 * 5 ;
}

// TODO
function StaffInRole( user: EfaasUsername, staffRole: StaffRole ) : boolean {
    return true ;
}

function NewInstanceId( len: number = 30 ) : string {
    let id: string = new Date().toISOString().replace( /\D/g, "" ) + "_" ;
    while ( id.length < len ) {
        id += Math.random().toString( 36 ).substring( 2 ) ; 
    }
    return id.substring( 0, len ) ;
}


