
enum FieldShowEnum { HIDDEN, LOCKED, EDITABLE }
enum WidgetEnum { TEXTBOX, TEXTAREA, DATE, CHECKBOX, OPTIONS, DROPDOWN }
enum WidgetWidth { }
enum ValidationMethodEnum { }

type DataType = string | number ;
type FieldName = string ;
type NodeClass = string ;
type InputNode = string ;

type DBlock = Map<string, DataType|DBlock> ;

type FieldValidation = {
    method: ValidationMethodEnum,
    value: DataType,
    arg1: DataType,
    arg2: DataType,
    arg3: DataType,
    arg4: DataType,
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
