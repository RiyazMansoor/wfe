
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