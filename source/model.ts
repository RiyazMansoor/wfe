
import { T_Email } from "./types";
import { ProjectError } from "./errors";
import { randomId } from "./util";


/**
 * All data within a workflow is either a string or a number
 */
export type Datum = string | number | DataSet ;

/**
 * The representation of all business data contained within any workflow.
 */
export type DataSet = { 
  [key: string]: Datum 
}
                                                                                                                                                                                              
/**
 * Workflow class id.
 * Used to instantiate the respective Workflow.
 */
export type WorkflowClassId = string;

/**
 * Every workflow will have a unique instance id.
 */
export type WorkflowInstanceId = string;

/**
 * Workflow statuses:
 * OPEN - this task is active.
 * CLOSED - this task has completed and is now closed. 
 */
export enum WorkflowStatus { 
    OPEN, 
    CLOSED 
}

/**
 * Task class id.
 * Used to instantiate the respective Task.
 */
export type TaskClassId = string;

/**
 * Every task will have a unique task id.
 */
export type TaskInstanceId = string;

/**
 * Task types:
 * SYSTEM type tasks are solely processed by the system automatically.
 * USER type tasks require valid user input before it is processed by the system. 
 */
export enum TaskType { 
    SYSTEM, 
    USER 
}

/**
 * Task statuses:
 * OPEN - this task is active.
 * CLOSED - this task has completed and is now closed. 
 */
export enum TaskStatus { 
    OPEN, 
    CLOSED 
}

/**
 * Work flow traversal edge froma task to any number of tasks.
 */
// type TaskClassEdge = [TaskClassId, TaskClassId[]];


/**
 * Public interface of a workflow object.
 * A workflow contains a series of tasks both sequentially or in parallel.
 */
export interface Workflow {

    /**
     * @see WorkflowClassId
     */
    getWorkflowClassId(): WorkflowClassId;

    /**
     * @see WorkflowInstanceId
     */
    getWorkflowInstanceId(): WorkflowInstanceId;

    /**
     * @see WorkflowStatus
     */
    getWorkflowStatsu(): WorkflowStatus;

    /**
     * Method called to ensure initial data and preconditions are met
     * before creating the workflow.
     * @param initData Initial data to start the workflow
     */
    preCreate(initData: DataSet): void;

    /**
     * Method called to ensure proper end of this workflow.
     */
    preClose(): void;

    /**
     * Returns the business service related data.
     * @see DataSet
     */
    getBussinesData(): DataSet;

    /**
     * Returns the administrative audit data.
     * These include created, closed times, users etc.
     * @see DataSet
     */
    getAuditData(): DataSet;

    getActiveTasks(): [TaskInstanceId, TaskClassId][];

    /**
     * Method called by tasks of this workflow when the task is completed.
     * This ensures the workflow progresses to the next task or closes.
     */
    taskCompleted(): void;

}


/**
 * Public interface of a task object within a workflow.
 */
export interface Task {

    /**
     * @return Workflow class id of the workflow instance to which this task instance belongs.
     */
    getWorkflowClassId(): WorkflowClassId;

    /**
     * @return Workflow instance id to which this task instance belongs.
     */
    getWorkflowInstanceId(): WorkflowInstanceId;
    
    /**
     * @see TaskClassId
     */
    getTaskClassId(): TaskClassId;

    /**
     * @see TaskInstanceId
     */
    getTaskInstanceId(): TaskInstanceId;

    /**
     * @see TaskStatus
     */
    getTaskStatus(): TaskStatus;

    /**
     * @see TaskType
     */
    getTaskType(): TaskType;

    /**
     * Returns the administrative audit data of this Task.
     * These include created, closed times, users etc.
     * @see DataSet
     * @return Audit data of this Task
     */
    getAuditData(): DataSet;

    /**
     * Method called to ensure initial data and preconditions are met
     * before creating this Task.
     * @param initData Initial data to start the workflow
     * @throws DataError Array of messages of preconditions not met.
     */
    preCreate(businessData: DataSet): void;

    /**
     * Method called to ensure proper end of this Task.
     */
    preClose(): void;

    /**
     * Method called to process this Task.
     * Parameter 'userData' is required if this Task is of type USER
     *   ie - requires user input.
     * @param userData Optional user data to process this task
     * @throws UserInputError If not required user input is missing
     */
    process(userData?: DataSet): void;

}

export abstract class AbstractWorkflow implements Workflow {

    /**
     * Business data record for this workflow.
     */
    protected dataObj: T_DataObj;

    /**
     * Unique work flow id.
     */
    protected workflowId: WorkflowInstanceId;



    /**
     * Constructor.
     * 
     * @param dataNew initial data to start this workflow 
     */
    constructor(startData: T_DataObj, edges: TaskClassEdge[]) {
        this.preConstruct(startData);
        this.workflowId = randomId(32);
    }

    getWorkflowInstanceId(): WorkflowInstanceId {
        return this.workflowId;
    }

    getDataObj(): T_DataObj {
        return this.dataObj;
    }

    /**
     * Called by the constructor to ensure the conditions to creating 
     * this workflow has been met.
     * 
     * @param dataNew initial data to start this workflow
     * @throws exception matching failed requirements
     */
    protected abstract preConstruct(dataNew: T_DataObj);

    /**
     * Creates and returns the next tasks in this workflow.
     */
    protected abstract createTasks(): ITask;


}

export abstract class AbstractTask implements Task {

    protected workflowClassId: WorkflowClassId;
    protected workflowInstanceId: WorkflowInstanceId;
    protected taskInstanceId: TaskInstanceId;
    protected taskClassId: TaskClassId;
    private taskStatus: TaskStatus;
    private taskType: TaskType;
    private auditData: DataSet;

    constructor(workflowData: BusinessData, workflowInstanceId: WorkflowInstanceId,
                taskClassId: TaskClassId) {
        this.workflowInstanceId = workflowInstanceId;
        this.taskClassId = taskClassId;
        this.taskInstanceId = randomId(32);
    }

    getWorkflowClassId(): WorkflowClassId {
        return this.workflowClassId;
    }

    getWorkflowInstanceId(): WorkflowInstanceId {
        return this.workflowInstanceId;
    }

    getTaskClassId(): TaskInstanceId {
        return this.taskClassId;
    }

    getTaskInstanceId(): TaskClassId {
        return this.taskInstanceId;
    }

    getTaskStatus(): TaskStatus {
        return this.taskStatus;
    }

    getTaskType(): TaskType {
        return this.taskType;
    }

    getAuditData(): DataSet {
        return this.auditData;
    }

    /**
     * Method called to ensure initial data and preconditions are met
     * before creating this Task.
     * @param initData Initial data to start the workflow
     * @throws DataError Array of messages of preconditions not met.
     */
    preCreate(businessData: DataSet): void {

    }

    preClose(): void {

    }

    process(userData?: DataSet): void {
        if (this.taskType == TaskType.USER && userData == null) {
            throw new DataError(`Expected user input data missing for TaskClassId="${this.taskClassId}", with TaskInstanceId="${this.taskInstanceId}"`);
        }
        if (this.taskType == TaskType.USER) {
            this.processInput(userData as DataSet);
        } else {
            this.processAuto();
        }
    }

    abstract processInput(userData: DataSet): void;
    abstract processAuto(): void;
    
}

export type EmailSchema = {
    to: T_Email,
    cc?: T_Email,

}
export class SendEmail extends Task {

    protected jsonProperties: string[];

    constructor(workflowData: T_DataObj, workflowInstanceId: WorkflowInstanceId,
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
