

type Email = string ;
type WfType = string ;
type NdType = string ;
type DUsername = string ;
type DInstanceId = string ;

type DType = string | number ;
type DBlock = Map<string, DType|DBlock> ;

type ParentWorkFlow = {
    pwfType: WfType,
    pwfInstanceId: DInstanceId,
    pwfNodeFromType: NdType,
    pwfNodeFromInstanceId: DInstanceId,
    pwfNodeToType: NdType,
    pwfNodeToInstanceId: DInstanceId,
}

type Workflow = {
    wfType: WfType,
    wfInstanceId: DInstanceId,
    wfStartedAt: number,
    wfEndedAt: number,
    wfParent: ParentWorkFlow,
    wfNodes: DInstanceId[]
}

enum NodeStatus { CREATED, READY, STARTED, ENDED }

class BaseWorkflow {

    protected wfType: string = null ;
    protected wfInstanceId: string = null ;

    protected wfStartedAt: number = Date.now() ;
    protected wfEndedAt: number = 0 ;
    
    protected wfParent: ParentWorkFlow = null ;
    protected wfNodes: DInstanceId[] = [] ;

    constructor() {
        // default empty constructor
    }

    protected End() : void {
        this.wfEnded = Date.now() ;
    }



    toJSON() : object {
        return {
            wfType: this.wfType,
            wfInstanceId: this.wfInstanceId,
            wfStartedAt: this.wfStartedAt,
            wfEndedAt: this.wfEndedAt,
            wfParent: this.wfParent,
            wfNodes: this.wfNodes
        }

    }

    toString() : string {
        return JSON.stringify( toJSON(), null, 2 ) ;
    }

    toObject( wf: Workflow ) : void {
        this.wfType = wf.wfType ;
        this.wfInstanceId = wf.wfInstanceId ;
        this.wfStartedAt = wf.wfStartedAt ;
        this.wfEndedAt = wf.wfEndedAt ;
        this.wfParent = wf.wfParent ;
        this.wfNodes = wf.wfNodes ;
    }

}

function wfSerialize( wfObject: object ) {

}

function wfDeserialize( wfType: string, wfInstanceId: DInstanceId ) : AbstractWorkflow {

}


/**
 * Boolean condition to check if this path of the workflow proceeds or terminates.
 * Called to check if the next node is to be created.
 * @param wfData current workflow data.
 * @returns <code>false</code> to end this workflow path.
 */
type NodePredicate = ( DBlock ) => boolean ;





abstract class Node {

    protected wfType: string ;
    protected wfInstanceId: string ;

    protected ndType: string ;
    protected ndInstanceId: string ;

    protected ndStartedAt: number = Date.now() ;
    protected ndEndedAt: number = 0 ;

    constructor() {
        // default constructor
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
    public Submit( wfData: DBlock ) : void {
        this.Validate( wfData ) ; // can throw validation exceptions
        // create next nodes.
        this.ndEndedAt = Date.now() ;
    }

    abstract protected CreateNext( wfData: DBlock ) : boolean ;

    toJSON() : object {
        return {
            wfType: this.wfType,
            wfInstanceId: this.wfInstanceId,
            ndType: this.ndType,
            ndInstanceId: this.ndInstanceId,
            ndStartedAt: this.ndStartedAt,
            ndEndedAt: this.ndEndedAt,
        }

    }

    toString() : string {
        return JSON.stringify( toJSON(), null, 2 ) ;
    }    

}

type PredicatePath = [ ( DBlock ) => boolean, WfType, NdType ] ; // string node-type

abstract class IfNode extends Node {

    protected routes: PredicatePath[] = [] ;

    constructor() {
        super() ;
    }

    protected CreateNext( wfData: DBlock ) : boolean {
        for ( const pp of routes ) {
            if ( pp( wfData ) ) {
                // create node ; 
                // create new workflow ;
                return true ;
            }
        }
        return false ;
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

