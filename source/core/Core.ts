

type NID = string ;
type Email = string ;
type DInstanceId = string ;

type DType = string | number ;

type DBlock = Map<string, DType|DBlock> ;

type Workflow = {
    wfType: string,
    wfInstanceId: DInstanceId,
    wfCreatedAt: number,
    wfCreatedBy: string,
    wfClosedAt: number,
    wfClosedBy: string,
    wfNodes: DInstanceId[]
}

type ParentWorkFlow = {
    pwfType: string,
    pwfInstanceId: DInstanceId,
    pwfNodeFromType: string,
    pwfNodeFromInstanceId: DInstanceId,
    pwfNodeToType: string,
    pwfNodeToInstanceId: DInstanceId,
}

abstract class Workflow {

    protected wfType: string = null ;
    protected wfInstanceId: string = null ;

    protected wfStarted: number = Date.now() ;
    protected wfEnded: number = Date.now() ;
    
    Workflow( type: string ) {
        this.wfType = type ;
    }

    protected End() : void {
        this.wfEnded = Date.now() ;
    }

}