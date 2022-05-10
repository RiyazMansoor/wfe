
enum FieldShowEnum { HIDDEN, LOCKED, EDITABLE }
enum WidgetEnum { TEXTBOX, TEXTAREA, DATE, CHECKBOX, OPTIONS, DROPDOWN }
enum WidgetWidth { Quarter, Third, Half, TwoThird, ThreeQuarter, Row }
enum ValidationMethodEnum { Pattern, Email, Numeric, AlphaNumeric, StringLength, NumberRange, DateRange }

type DataType = string | number ;
type FieldName = string ;
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
    name: FieldName,
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
        field: FieldName,
        visibility: FieldShowEnum
    }[],
}

type Predicate = ( DBlock ) => boolean ;

type Flow = {
    from: NodeClass,
    to: { 
        precondition: Predicate,
        node:NodeClass,
    }[]
}

type FlowDefn = {
    fields: Field[],
    userinputs: InputNode[],
    flows: Flow[],
}

type DInstanceId = string ;
type DFlowInstanceId = DInstanceId ;
type DNodeInstanceId = DInstanceId ;
type DBlock = Map<string, DataType|DBlock> ;

type Instance = {
    class: string,
    instanceId: DInstanceId,
    startAt: number,
    endedAt: number,
}

type NodeInstance = Instance & {
    wfClass: string,
    wfInstanceId: DFlowInstanceId,
    ndSLA: number,
} 

type FlowInstance = {
    wfHistory: DNodeInstanceId[],
    wfActiveNodes: DInstanceId[],
    wfData: DBlock,
    pndJoinKey: NdJoinKey,
    pndInstanceId: DInstanceId,
}

abstract class AbstractInstance {

    protected instance: Instance = {
        class: this.constructor.name,
        instanceId: NewInstanceId(),
        startedAt: Date.now(),
        endedAt: 0
    }

    constructor() {
        super() ;
    }

    constructor( serialized: { instance: Instance } ) {
        super() ;
        this.instance = serialized.instance ;
    }

    public toJSON() : { instance: Instance } {
        return { instance: this.instance } ;
    }

    public toString() : string {
        return JSON.stringify( toJSON(), null, 2 ) ;
    }

}

abstract class AbstractFlowInstance extends AbstractInstance {

    protected flowDefn: FlowDefn = null ;

    protected flowInstance: FlowInstance = {

    }
    
    public toJSON() : { flowInstance: FlowInstance } {
        const obj = super.toJSON() ;
        obj.flowInstance = this.flowInstance ;
        return obj ;
    }

}

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
