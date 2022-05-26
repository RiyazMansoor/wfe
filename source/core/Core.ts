
import { NewInstanceId } from "./Utils" ;

enum NodeStatus { CREATED, READY, STARTED, ENDED }

type Email = string ;
type DateTime = number ;
type Html = string ;
type EfaasUsername = string ;
type StaffRole = string ;
type SLA = number ; // work hours

type DataType = string | number ;
type DataBlock = {
    [index: string]: DataType | DBlock
} ;
type FormData = DataBlock ;

type WfType = string ;
type WfInstanceId = string ;
type NdType = string ;
type NdInstanceId = string ;
 
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
 

type NodeType = {
    ndType: NdType,
    ndInstanceId: NdInstanceId,
    wfType: WfType,
    wfInstanceId: WfInstanceId,
    ndStartAt: DateTime,
    ndEndedAt: DateTime,
    ndSLA: SLA,
    ndReadData: DataBlock,
    ndEditData: DataBlock,
    ndStaffRole: StaffRole,
    ndForm: Form
} ;

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


abstract class Node {

    protected wfType: string ;
    protected wfInstanceId: string ;

    protected ndType: string ;
    protected ndInstanceId: string ;

    protected ndStartedAt: number = Date.now() ;
    protected ndEndedAt: number = 0 ;

    protected paths: PredicatePath[] = [] ;

    constructor() {
        super() ;
    }

    /**
     * Where required every node must implement data validation.
     * @param wfData current workflow data.
     * @throws array of validation exceptions.
     */
    protected Validate( wfData: DBlock ) : void {
        // default implementation - no validation required / pass through
    }

    /**
     * 
     * @param wfData current workflow data.
     * @throws array of validation exceptions.
     */
    public Submit( wfData: DBlock ) : boolean {
        this.Validate( wfData ) ; // can throw validation exceptions
        const result = this.CreateNext( wfData ) ;
        if ( result ) {
            this.ndEndedAt = Date.now() ;
        }
        return result ;
    }

    abstract protected CreateNext( wfData: DBlock ) : boolean ;

    toJSON() : object {
        return {
            wfInstanceId: this.wfInstanceId,
            ndInstanceId: this.ndInstanceId,
            ndStartedAt: this.ndStartedAt,
            ndEndedAt: this.ndEndedAt,
        }

    }

    toString() : string {
        return JSON.stringify( toJSON(), null, 2 ) ;
    }    

}

abstract class Flow {

    protected defn ;

    protected flow: FlowType = {
        wfType = null,
        wfInstanceId = null,
        wfStartAt = Date.now(),
        wfEndedAt = 0,
        wfNodes = [],
        wfActiveNodes = [],
        wfData = null,
        pndJoinKey = null,
        pndInstanceId = null,
    } ;

    constructor() {
        super() ;
        this.flow.wfType = this.constructor.name ;
        this.flow.wfInstanceId = NewInstanceId() ;
    }

    constructor( serialized: { flow: FlowType } ) {
        super() ;
        this.flow = serialized.flow ;
    }

    End() : void {
        this.wfEnded = Date.now() ;
    }

    AddNode( ndInstanceId: DInstanceId ) {
        this.wfNodes.push( ndInstanceId ) ;
        this.wfActiveNodes.push( ndInstanceId ) ;
    }

    SetNonActive( ndInstanceId: DInstanceId ) : void {
        this.wfActiveNodes = this.wfActiveNodes.filter( id => ndInstanceId != id ) ;
    }

    toJSON() : object {
        return { flow: this.flow } ;
    }

    public toString() : string {
        return JSON.stringify( toJSON(), null, 2 ) ;
    }

    static Serialize( flow: FlowType ) : boolean {

    }

    static DeSerialize( wfInstanceId: DInstanceId ) : FlowType  {
        return null ;
    }

}

function wfSerialize( wfObject: object ) {

}

function wfDeserialize( wfInstanceId: DInstanceId ) : AbstractWorkflow {

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



abstract class InputNode extends Node {

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

class InputNode extends AbstractNode {


}

