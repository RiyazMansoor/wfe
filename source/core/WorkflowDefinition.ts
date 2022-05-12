
import { NewInstanceId, PrimitiveDeepCopy } from "./Util";


enum FieldShowEnum { HIDDEN, LOCKED, EDITABLE }
enum WidgetEnum { TEXTBOX, TEXTAREA, DATE, CHECKBOX, OPTIONS, DROPDOWN }
enum WidgetWidth { Quarter, Third, Half, TwoThird, ThreeQuarter, Row }
enum ValidationMethodEnum { Pattern, Email, Numeric, AlphaNumeric, StringLength, NumberRange, DateRange }

type DataType = string | number ;
type DataKey = string ;
type NodeClass = string ;
type InputNode = string ;

type FieldValidation = {
    method: ValidationMethodEnum,
    value: DataType,
    args: { 
        name: string,
        value: DataType,
    }[],
}

type Field = {
    key: DataKey,
    value: DataType,
    validations: FieldValidation[],
    ui: {
        label: string,
        default: DataType,
        hint: string,
        width: WidgetWidth,
        widget: WidgetEnum,
    }
}

type Node = {
    class: NodeClass,
    type: NodeEnum,
}
type InputNode = Node & {
    title: string,
    fields: {
        fieldkey: DataKey,
        visibility: FieldShowEnum
    }[],
}

type Predicate = ( DBlock ) => boolean ;

type Flow = {
    from: NodeClass,
    to: { 
        precondition: Predicate,
        type: "F" | "N",
        class:NodeClass,
    }[]
}

type FlowDefn = {
    fields: Field[],
    userinputs: InputNode[],
    flows: Flow[],
    start: NodeClass
}

type DInstanceId = string ;
type DFlowInstanceId = DInstanceId ;
type DNodeInstanceId = DInstanceId ;
type DBlock = Map<string, DataType|DBlock> ;
type DBlock = {
    [ index: string ]: string | number | DBlock
}

type Instance = {
    core: {
        wfClass: string,
        wfInstanceId: DFlowInstanceId,
        startAt: number,
        endedAt: number,
    }
}

type NodeInstance = Instance & {
    node: {
        ndClass: string,
        ndInstanceId: DNodeInstanceId,
        ndSLA: number,
    }
} 

type FlowInstance = Instance & {
    flow: {
        wfHistory: DNodeInstanceId[],
        wfActiveNodes: DInstanceId[],
        wfData: DBlock,
        pndJoinKey: NdJoinKey,
        pndInstanceId: DInstanceId,
    }
}

type NodeInstantiator = ( NodeClass ) => AbstractNodeInstance ;


abstract class AbstractInstance {

    protected core: Instance = {
        core: {
            wfClass: this.constructor.name,
            wfInstanceId: NewInstanceId(),
            startedAt: Date.now(),
            endedAt: 0,
        }
    }

    constructor() {
        super() ;
    }

    constructor( serialized: Instance ) {
        super() ;
        this.core.core = serialized.core ;
    }

    public toJSON() : Instance {
        return this.core ;
    }

    public toString() : string {
        return JSON.stringify( toJSON(), null, 2 ) ;
    }

}

abstract class AbstractFlowInstance extends AbstractInstance {

    protected flowDefn: FlowDefn = null ;

    protected nodeInstantiator: NodeInstantiator = null ;

    protected flowInstance: FlowInstance = { 
        flow: {
            wfHistory =[],
            wfActiveNodes = [],
            wfData = null,
            pndJoinKey = null,
            pndInstanceId = null,
        }
    }

    constructor() {
        super() ;
    }

    constructor( serialized: { flowInstance: FlowInstance } ) {
        super( flowInstance ) ;
        this.flowInstance.flow = serialized.flow ;
    }

    public Start() {

    }

    public Next() {

    }

    public End() {

    }

    private nextNodes( currNode: NodeClass ) : NodeClass[] {
        if ( !currNode ) {
            return [ this.flowDefn.start ] ;
        }
        return this.flowDefn.flows.find( flow => flow.from == currNode.nodeInstance.class ).to
                    .filter( ob => ob.precondition( this.flowInstance.wfData ) )
                    .map( ob => ob.node ) ;
    }

    public NextStep( currNodeClass: NodeClass, data: DBlock ) {
        if ( !currNodeClass ) {

        }
    }

    public toJSON() : { flowInstance: FlowInstance } {
        const obj = super.toJSON() ;
        obj.flow = this.flowInstance.flow ;
        return obj ;
    }

}

abstract class AbstractNodeInstance {


    constructor() {
        super() ;
    }

    public Predicate( wfData: DBlock ) : boolean {
        return true ;
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
