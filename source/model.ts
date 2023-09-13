
import { randomId } from "./util";


type Datum = string | number ;
type DataRecord = { [key: string]: Datum } ;

type WorkflowId = string;
type TaskId = string;


/**
 * Public interface of a workflow object.
 * A workflow contains a series of tasks both sequentially or in parallel
 */
export interface IWorkflow {

    /**
     * Returns the unique id of this workflow.
     * 
     * @return the unique id of this workflow
     */
    getWorkflowId(): WorkflowId;

    /**
     * Returns the business data contained in this workflow.
     * 
     * @return  the business data contained in this workflow
     */
    getDataRecord(): DataRecord;

}


/**
 * Public interface of a task object within a workflow.
 */
export interface ITask {

    getWorkflowId(): WorkflowId;
    
    getTaskId(): TaskId;

}

export abstract class Workflow implements IWorkflow {

    /**
     * Business data record for this workflow.
     */
    protected dataRecord: DataRecord;

    /**
     * Unique work flow id.
     */
    protected workflowId: WorkflowId;



    /**
     * Constructor.
     * 
     * @param dataNew initial data to start this workflow 
     */
    constructor(dataWorkflowStart: DataRecord) {
        this.validateDataWorkflowStart(dataWorkflowStart);
        this.workflowId = randomId(32);
    }

    getWorkflowId(): WorkflowId {
        return this.workflowId;
    }

    getDataRecord(): DataRecord {
        return this.dataRecord;
    }

    /**
     * Called by the constructor to ensure the conditions to creating 
     * this workflow has been met.
     * 
     * @param dataNew initial data to start this workflow
     * @throws exception matching failed requirements
     */
    protected abstract validateDataWorkflowStart(dataNew: DataRecord);

    /**
     * Creates and returns the next tasks in this workflow.
     */
    protected abstract createTasks(): ITask;


}