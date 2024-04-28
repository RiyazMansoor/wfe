
/**
 * 
 * 

tasks: [
    {
        id: string,
        classname: string,
    }
]

transitions: [
    {
        from: taskid,
        next: [
            {
                to: taskid,
                condition: conditionFunc,
            }
        ]
    }
]

 */

import { DataMap } from "./datamap";

type FlowId = string;
type FlowNextCondition = (datamap: DataMap) => boolean;

type TaskDef = {
    flowId: FlowId,
    className: string,
}

type NextTaskDef = {
    flowId: FlowId,
    condition: FlowNextCondition,
}

type TransitionDef = {
    fromFlowId: FlowId,
    nextFlows: NextTaskDef[],
}

type FlowDef = {
    tasks: TaskDef[],
    transitions: TransitionDef[],
}

export interface Flow {


}

export class AbstractFlow implements Flow {

    private flowDef: FlowDef;
    private flowData: DataMap;

    constructor(flowDef: FlowDef, initData: DataMap) {
        this.flowDef = flowDef;
        this.flowData = initData;
    }

    
}