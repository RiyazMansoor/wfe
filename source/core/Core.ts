
import { NewInstanceId } from "./Utils" ;


type Email = string ;
type DateTime = number ;
type Key = string ;
type Html = string ;
type EfaasUsername = string ;
type StaffRole = string ;
type SLA = number ; // work hours

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
    message: string
}

enum NodeStatus { Waiting, Started, Ended }
enum NodeAction { Submit, Review, Reject, Approve, UserResubmit } ;

type BaseNd = {
    ndType: NdType,
    ndInstanceId: NdInstanceId,
    wfType: WfType,
    wfInstanceId: WfInstanceId,
    ndCreatedAt: DateTime,
    ndClosedAt: DateTime,
    ndActions: {
        [index: NodeAction]: NdType[]
    },
    ndFlows: WfType[],
} ;

function FetchNd( ndType: ndType, ndInstanceId: ndInstanceId ) : BaseNode {
    // TODO
    return null ;
}
function SaveNd( ndObject: { baseNd: BaseNd } ) : void {
    // TODO
}

type BaseInputNd = {
    ndSLA: SLA,
    ndStaffRole: StaffRole,
    ndStaffUser: EfaasUsername,
    ndStatus: NodeStatus,
    ndEditData: Key[],
}


type BaseWf = {
    wfType: WfType,
    wfInstanceId: WfInstanceId,
    wfCreatedAt: DateTime,
    wfClosedAt: DateTime,
    wfData: DataBlock,
    pwfType: WfType,
    pwfInstanceId: WfInstanceId,
} ;

function FetchWf( wfType: WfType, wfInstanceId: WfInstanceId ) : BaseFlow {
    // TODO
    return null ;
}
function SaveWf( baseWf: BaseWf ) : void {
    // TODO
}















type Input = {
    key: string,
    value: DataType,
    default: DataType,
    label: string,
    tip: Html,
//    validation: ( DType ) => boolean,
}

enum InputWidth { Quarter, Half, ThreeQuarter, Third, TwoThird, Rest }
type InputRow = [
    { width: InputWidth, input: Input }
]
type Form = {
    title: string,
    inputrows: InputRow[],
    actions: Actions[];

}
 


/**
 * Boolean condition to check if this path of the workflow proceeds or terminates.
 * Called to check if the next node is to be created.
 * @param wfData current workflow data.
 * @returns <code>false</code> to end this workflow path.
 */
type Predicate = ( DBlock ) => boolean ;
const PredicateTrue: Predicate = ( wfData: DBlock ) => true ;
 
type NewNode = () => Node ;
type PredicatePath = [ Predicate, NewNode ] ; // string node-type 
 
type Path = {

}
type FlowDefn = {
    fields: Field[],
    flows: Flows[]
}

type FlowType = {
    wfType: WfType,
    wfInstanceId: DInstanceId,
    wfStartAt: number,
    wfEndedAt: number,
    wfNodes: DInstanceId[],
    wfActiveNodes: DInstanceId[],
    wfData: DBlock,
    pndJoinKey: NdJoinKey,
    pndInstanceId: DInstanceId,
} ;



abstract class BaseNode {

    protected baseNd: BaseNd = {
        ndType: null,
        ndInstanceId: null,
        wfType: WfType,
        wfInstanceId: WfInstanceId,
        ndCreatedAt: Date.now(),
        ndClosedAt: 0,
        ndActions: {},
        ndFlows: [],
    } ;

    // does not save this Nd
    constructor( baseWf: BaseWf ) {
        super() ;
        const messages: Message[] = this.execPredicate( baseWf.wfData ) ;
        if ( messages.length > 0 ) throw messages ;
        // all good - construct this node
        this.baseNd.NdType = this.constructor.name ;
        this.baseNd.NdInstanceId = NewInstanceId() ;
        this.baseNd.wfType = baseWf.wfType ;
        this.baseNd.wfInstanceId = baseWf.wfInstanceId ;
    }

    constructor( serialized: { baseNd: BaseNd } ) {
        super() ;
        this.baseNd = serialized.baseNd ;
    }

    // default pass through predicate, else over ride
    execPredicate( wfData: DataBlock ) : Message[] {
        return [] ; 
    }

    protected validateSubmission( ndData: DataBlock ) : Message[] {
        return [] ; // default - no validation required / pass through
    }

    protected mergeData( ndData: DataBlock, wfData: DataBlock ) : void {
        // default
    }

    abstract protected nextNodeTypes( ndData: DataBlock ) : NdType[] ;

    /**
     * 
     * @param wfData current workflow data.
     * @throws array of validation exceptions.
     */
    Submit( ndData: DataBlock ) : void {
        const messages: Message[] = this.validateSubmission( ndData ) ;
        if ( messages.length > 0 ) throw messages ;
        // create next node[s]
        this.baseNd.ndClosedAt = Date.now() ;
        const baseFlow: BaseFlow = FetchWf( this.baseNd.wfType, this.baseNd.wfInstanceId ) ;
        this.mergeData( ndData, baseFlow.baseWf.wfData ) ; // todo
        const nextNdTypes: NdType[] = this.nextNodeTypes( ndData ) ;
        for ( const ndType of nextNdTypes ) {
            baseFlow.createNode( ndType ).save() ; 
        }
        this.save() ;
        if ( nextNdTypes.length == 0 ) baseWf.close() ;
        baseFlow.save() ;
    }

    save() : void {
        SaveNd( this.toJSON ) ;
    }

    toJSON() : { baseNd: BaseNd } {
        return { baseNd: this.baseNd } ;
    }

    toString() : string {
        return JSON.stringify( toJSON(), null, 2 ) ;
    }    

}

abstract class BaseInputNode extends BaseNode {

    protected ndStatus: NodeStatus = NodeStatus.CREATED ;
    protected ndUser: string = "" ;

    public Start( user: string ) : void {
        if ( this.ndStatus != NodeStatus.READY ) {
            throw `Node type=${this.ndName} instance=${this.ndInstanceId} is not READY.` ;
        }
        this.ndStatus = NodeStatus.STARTED ;
        this.ndUser = user ;
    }

    public Return( user: string ) : void {
        if ( this.ndStatus != NodeStatus.STARTED ) {
            throw `Node type=${this.ndName} instance=${this.ndInstanceId} has not been STARTED.` ;
        }
        if ( this.ndUser != user ) {
            throw `Node type=${this.ndName} instance=${this.ndInstanceId} staff=${this.ndUser} already working.` ;
        }
        this.ndUser = "" ;
        this.ndStatus = NodeStatus.READY ;
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


    /**
     * Some nodes require user input. This property is the indicator.
     * @returns <code>true</code> if user input required
     */
    public HasInput() : boolean {
        return false ;
    }

    /**
     * For nodes that require user input, returns the html to cpature user input.
     * @param wfData current workflow data.
     * @returns <code>html</code> input form as a string to capture user input.
     * @see #HasInput
     */
    public InputForm( wfData: DBlock ) : string {
        return undefined ;
    }

    toJSON() : object {
        const obj = super.toJSON() ;
        obj.ndStatus = this.ndStatus ;
        obj.ndUser = this.ndUser ;
        return obj ;
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

    constructor( startData: DataBlock ) {
        super() ;
        const messages: Message[] = this.execPredicate( startData ) ;
        if ( messages.length > 0 ) throw messages ;
        // all ok, construct workflow
        this.baseWf.wfType = this.constructor.name ;
        this.baseWf.wfInstanceId = NewInstanceId() ;
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

    abstract createNode( ndType: NdType ) : BaseNode ;

    abstract updateFromSubFlow( swfData: DataBlock ) ;

    close() {
        this.baseWf.wfClosedAt = Date.now() ;
        if ( this.baseWf.pwfType ) {
            const pbaseFlow: BaseFlow = FetchWf( this.baseWf.pwfType, this.baseWf.pwfInstanceId ) ;
            pbaseFlow.updateFromSubFlow( this.baseWf.wfData ) ;
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




class InputNode extends AbstractNode {


}

