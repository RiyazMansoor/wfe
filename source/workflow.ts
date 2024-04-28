
import { AuditLog, AuthId, DataSet } from "./types";
import { randomId, timestampString } from "./util";


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
 * Key ids in a workflow.
 * Key fields in lookup,serialization and  deserialization
 */
export type WorkflowIds = {
    workflowClassId: WorkflowClassId,
    workflowInstanceId: WorkflowInstanceId,
}

/**
 * Data structure of a workflow.
 * 
 */
export type WorkflowData = {
    workflowIds: WorkflowIds,
    workflowStatus: WorkflowStatus,
    workflowType: WorkflowType,
    workflowParent?: WorkflowIds,   // if the workflowType == SECONDARY
    businessData:  DataSet,
    auditData: AuditLog[],
}



/**
 * Public interface of a workflow object.
 * A workflow contains a series of tasks both sequentially or in parallel.
 */
export interface Workflow {

    /**
     * @see WorkflowIds
     */
    getWorkflowIds(): WorkflowIds;

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
    getAuditData(): AuditLog[];

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
    toSerialize(): WorkflowData;
    
}



export abstract class AbstractWorkflow implements Workflow {

    /**
     * Data structure of a workflow
     */
    protected workflowData: WorkflowData;

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
    constructor(data: DataSet|WorkflowData, authId?: AuthId, workflowClassId?: WorkflowClassId, workflowParent?: WorkflowIds) {
        if (data.workflowIds) {
            // instance creation from existing data
            this.workflowData = data as WorkflowData;
        } else {
            // this will throw an erro if preconditions are not met
            const businessData = this.preCreate(data as DataSet);
            // if NO error thrown lets create this workflow
            const workflowIds = { 
                workflowClassId: workflowClassId as WorkflowClassId,
                workflowInstanceId: randomId(32) 
            }
            const auditLog: AuditLog = {
                timestamp: timestampString(),
                authId: authId as AuthId,
                logType: "CREATED",
                logText: `workflow created :: classId=${workflowIds.workflowClassId} instanceId=${workflowIds.workflowInstanceId}`
            }
            const workflowType = arguments.length == 5 ? WorkflowType.SECONDARY : WorkflowType.PRIMARY;
            this.workflowData = {
                workflowIds : workflowIds,
                workflowStatus: WorkflowStatus.OPEN,
                workflowType:  workflowType,
                businessData:  businessData,
                auditData: [ auditLog ],                
            };
            if (arguments.length == 5) {
                this.workflowData.workflowParent = workflowParent as WorkflowIds;
            }
            // TODO 
            // create start task
            // save start task
            // save workflow
        }
    }

    abstract preCreate(initData: DataSet): DataSet;

    abstract preClose(): void;

    getWorkflowIds(): WorkflowIds {
        return this.workflowData.workflowIds;
    }

    getWorkflowStatus(): WorkflowStatus {
        return this.workflowData.workflowStatus;
    }

    getWorkflowType(): WorkflowType {
        return this.workflowData.workflowType;
    }

    getBussinesData(): DataSet {
        return this.workflowData.businessData;
    }

    getAuditData(): AuditLog[] {
        return this.workflowData.auditData;
    }

    toSerialize(): WorkflowData {   
        return this.workflowData;
    }

    notifyTaskCompleted(): void {
        throw new Error("Method not implemented.");
    }



}

