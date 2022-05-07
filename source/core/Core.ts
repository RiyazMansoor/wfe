

type Email = string ;

type DUsername = string ;
type DInstanceId = string ;

type DType = string | number ;

type DBlock = Map<string, DType|DBlock> ;

type ParentWorkFlow = {
    pwfType: string,
    pwfInstanceId: DInstanceId,
    pwfNodeFromType: string,
    pwfNodeFromInstanceId: DInstanceId,
    pwfNodeToType: string,
    pwfNodeToInstanceId: DInstanceId,
}

type Workflow = {
    wfType: string,
    wfInstanceId: DInstanceId,
    wfStartedAt: number,
    wfEndedAt: number,
    wfParent: ParentWorkFlow,
    wfNodes: DInstanceId[]
}

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
        return JSON.stringify( toJSON() ) ;
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

enum NodeType { INPUT, CHOOSE, AND }

abstract class AbstractNode {

    protected ndName: string ;
    protected ndInstanceId: string ;

    protected ndStartedAt: number = Date.now() ;
    protected ndEndedAt: number = 0 ;

    protected ndType: NodeType ;

    constructor() {
        // default constructor
    }

    public Ended() : void {
        this.ndEndedAt = Date.now() ;
    }

    public Display() : string {
        return undefined ;
    }

    

}

class InputNode extends AbstractNode {


}