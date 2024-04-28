
enum FieldType {
    TEXT,
    EMAIL,
    DATE,
    TIME,
}

enum FieldWidth {

}

type BaseField = {
    label: string,
    type: FieldType,
    hint: string,
    width: FieldWidth,
    defValue: string,
}

type ListField = BaseField & {
    listValues: string[],
    listLabels: string[],
    listHtml: string,
}

export interface Field {
    
    setValue(value: string): void;

    render(): string;

}

export abstract class AbstractField implements Field {

    private label: string;
    private type: FieldType;
    private hint: string;
    private defaultValue: string;
    private width: string;

    private value: string;

    constructor(label: string, type: FieldType, hint: string = "", defaultValue: string = "") {
        this.label = label;
        this.type = type;
        this.hint = hint;
        this.defaultValue = defaultValue;
    }

    setValue(value: string): void {
        this.value = value;
    }

    render(): string {
        throw new Error("Method not implemented.");
    }

}
