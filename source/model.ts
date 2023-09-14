
import { ProjectError } from "./errors";
import { randomId } from "./util";


/**
 * All data within a workflow is either a string or a number
 */
export type Datum = string | number | BusinessData ;

/**
 * The representation of all business data contained within any workflow.
 */
export type BusinessData = { 
    [key: string]: Datum 
}

/**
 * Every workflow will have a unique instance id.
 */
type WorkflowInstanceId = string;

/**
 * Every task will have a unique task id.
 */
type TaskInstanceId = string;

/**
 * Task class id within a workflow.
 * Used to instantiate the respective Task.
 */
type TaskClassId = string;

/**
 * Work flow traversal edge froma task to any number of tasks.
 */
type TaskClassEdge = [TaskClassId, TaskClassId[]];


/**
 * Public interface of a workflow object.
 * A workflow contains a series of tasks both sequentially or in parallel
 */
export interface IWorkflow {

    /**
     * @see WorkflowInstanceId
     */
    getWorkflowInstanceId(): WorkflowInstanceId;

    /**
     * @see BusinessData
     */
    getBusinessData(): BusinessData;

}


/**
 * Public interface of a task object within a workflow.
 */
export interface ITask {

    /**
     * @see TaskClassId
     */
    getTaskClassId(): TaskClassId;

    /**
     * @see WorkflowInstanceId
     */
    getWorkflowInstanceId(): WorkflowInstanceId;
    
    /**
     * @see TaskInstanceId
     */
    getTaskInstanceId(): TaskInstanceId;

}

export abstract class Workflow implements IWorkflow {

    /**
     * Business data record for this workflow.
     */
    protected dataRecord: BusinessData;

    /**
     * Unique work flow id.
     */
    protected workflowId: WorkflowInstanceId;



    /**
     * Constructor.
     * 
     * @param dataNew initial data to start this workflow 
     */
    constructor(startData: BusinessData, edges: TaskClassEdge[]) {
        this.preConstruct(startData);
        this.workflowId = randomId(32);
    }

    getWorkflowInstanceId(): WorkflowInstanceId {
        return this.workflowId;
    }

    getBusinessData(): BusinessData {
        return this.dataRecord;
    }

    /**
     * Called by the constructor to ensure the conditions to creating 
     * this workflow has been met.
     * 
     * @param dataNew initial data to start this workflow
     * @throws exception matching failed requirements
     */
    protected abstract preConstruct(dataNew: BusinessData);

    /**
     * Creates and returns the next tasks in this workflow.
     */
    protected abstract createTasks(): ITask;


}

export abstract class Task implements ITask {

    protected workflowInstanceId: WorkflowInstanceId;
    protected taskInstanceId: TaskInstanceId;
    protected taskClassId: TaskClassId;

    constructor(workflowData: BusinessData, workflowInstanceId: WorkflowInstanceId,
                taskClassId: TaskClassId) {
        this.workflowInstanceId = workflowInstanceId;
        this.taskClassId = taskClassId;
        this.taskInstanceId = randomId(32);
    }

    getTaskClassId(): string {
        return this.taskClassId;
    }

    getWorkflowInstanceId(): string {
        return this.workflowInstanceId;
    }

    getTaskInstanceId(): string {
        return this.taskInstanceId;
    }

    protected abstract preConstruct();
    
}

export class SendEmail extends Task {

    protected jsonProperties: string[];

    constructor(workflowData: BusinessData, workflowInstanceId: WorkflowInstanceId,
                jsonProperties: string[]) {
        super(workflowData, workflowInstanceId, "0");
        this.jsonProperties = jsonProperties;
        const errors: ProjectError[] = [];
        for (const prop of jsonProperties) {
            try {
                
            } catch (err) {
                errors.push(err);
            }
        }
    }

    protected preConstruct() {
        throw new Error("Method not implemented.");
    }


}
