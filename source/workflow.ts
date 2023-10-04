
import { AuditLog, AuthId } from "./types";
import { randomId, timestampString } from "./util";


/**
 * All data within a workflow is either a string or a number
 */
export type Datum = string | number | AuditLog[] | DataSet ;

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
 * Workflow types:
 * PRIMARY - directly initiated.
 * SECONDARY - initiated by another workflow. 
 */
export enum WorkflowType { 
    PRIMARY, 
    SECONDARY 
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
    getWorkflowStatus(): WorkflowStatus;

    /**
     * @see WorkflowType
     */
    getWorkflowType(): WorkflowType;

    /**
     * Method called to ensure initial data and preconditions are met
     * before creating the workflow.
     * @param initData Initial data to start the workflow
     * @returns validated dataset ready for workflow creation
     */
    preCreate(initData: DataSet): DataSet;

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

    /**
     * Method called by tasks of this workflow when the task is completed.
     * This ensures the workflow progresses to the next task or closes.
     */
    notifyTaskCompleted(): void;

    /**
     * Complete data set for this workflow.
     * Used in serialization and deserialization.
     * @returns data set representation of this workflow
     */
    toJSON(): DataSet;

    
}



export abstract class AbstractWorkflow implements Workflow {

    /**
     * Unique work flow class id.
     * Used in serialization and deserialization.
     */
    protected workflowClassId: WorkflowClassId;

    /**
     * Unique workflow instance id.
     * Used in serialization and deserialization and to uniquely identify this instance.
     */
    protected workflowInstanceId: WorkflowInstanceId;

    /**
     * Status (enum) of this workflow.
     */
    protected workflowStatus: WorkflowStatus;

    /**
     * Type (enum) of this workflow.
     */
    protected workflowType: WorkflowType;

    /**
     * If this is a WorkflowType.SECONDARY type workflow 
     * Then the parent workflows class id.
     */
    protected workflowParentClassId: WorkflowClassId;

    /**
     * If this is a WorkflowType.SECONDARY type workflow 
     * Then the parent workflows class id.
     */
    protected workflowParentInstanceId: WorkflowInstanceId;

    /**
     * Audit administrative data relating to this workflow.
     */
    protected workflowAuditData: AuditLog[];

    /**
     * Business data of this workflow.
     */
    protected workflowBusinessData: DataSet;

    /**
     * Muliti purpose constructor.
     * Creates new workflow instances.
     * Deserializes existing workflows into workflow instances.
     * 
     * @param data initial data to start a workflow or json data to deserialize a workflow
     * @param workflowClassId workflow class id  when creating a new workflow
     * @param workflowType workflow type when creating a new workflow
     * @throws WorkflowPreCreateError if the supplied initial data is insufficient 
     */
    constructor(data: DataSet, authId?: AuthId, workflowClassId?: WorkflowClassId, 
                workflowParentClassId?: WorkflowClassId, workflowParentInstanceId?: WorkflowInstanceId) {
        switch (arguments.length) {
            case 1:
                // instance creation from existing data
                this.workflowBusinessData = data.workflowBusinessData as DataSet;
                this.workflowClassId = data.workflowClassId as WorkflowClassId;
                this.workflowInstanceId = data.workflowInstanceId as WorkflowInstanceId;
                this.workflowStatus = data.workflowStatus as WorkflowStatus;
                this.workflowType = data.workflowType as WorkflowType;
                this.workflowParentClassId = data.workflowParentClassId as WorkflowClassId;
                this.workflowParentInstanceId = data.workflowParentInstanceId as WorkflowInstanceId;
                this.workflowAuditData = data.workflowAuditData as AuditLog[];
                break;
            case 3:
                // instance creation from new supplied parameters - PRIMARY workflow
                this.workflowBusinessData = this.preCreate(data);
                this.workflowClassId = workflowClassId as WorkflowClassId;
                this.workflowInstanceId = randomId(32);
                this.workflowStatus = WorkflowStatus.OPEN;
                this.workflowType = WorkflowType.PRIMARY;
                this.workflowParentClassId = "";
                this.workflowParentInstanceId = "";
                this.workflowAuditData = [];
                const auditLog: AuditLog = {
                    timestamp: timestampString(),
                    authId: authId as AuthId,
                    logType: "CREATED",
                    logText: `workflow created :: classId=${this.workflowClassId} instanceId=${this.workflowInstanceId}`
                }
                this.workflowAuditData.push(auditLog);
                // fall through to next case
            case 5:
                // instance creation from new supplied parameters - SECONDARY workflow
                if (arguments.length == 5) {
                    this.workflowType = WorkflowType.SECONDARY;
                    this.workflowParentClassId = workflowParentClassId as WorkflowClassId;
                    this.workflowParentInstanceId = workflowParentInstanceId as WorkflowInstanceId;
                }
                // TODO 
                // create start task
                // save start task
                // save workflow
                break;
            default:
                throw `AbstractWorkflow Number of Arguments Error :: Expected=1|3|5, Actual=${arguments.length}`;
        }
    }

    abstract preCreate(initData: DataSet): DataSet;

    abstract preClose(): void;

    getWorkflowClassId(): WorkflowClassId {
        return this.workflowClassId;
    }

    getWorkflowInstanceId(): WorkflowInstanceId {
        return this.workflowInstanceId;
    }

    getWorkflowStatus(): WorkflowStatus {
        return this.workflowStatus;
    }

    getWorkflowType(): WorkflowType {
        return this.workflowType;
    }

    getAuditData(): DataSet {
        return this.workflowAuditData;
    }

    getBussinesData(): DataSet {
        return this.workflowBusinessData;
    }

    toJSON(): DataSet {
        return {
            workflowClassId: this.workflowClassId,
            workflowInstanceId: this.workflowInstanceId,
            workflowStatus: this.workflowStatus,
            workflowType: this.workflowType,
            workflowAuditData: this.workflowAuditData,
            workflowBusinessData: this.workflowBusinessData
        }    
    }

    notifyTaskCompleted(): void {
        throw new Error("Method not implemented.");
    }



}

