/**
 * Task - A unit of work in a workflow.
 * 
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20240423 v0.1
 */

import { DataMap } from "./datamap";
import { T_ClassName, T_Instance } from "./types";



/**
 * TaskStatus defines the state of the task, NOT the result of the task.
 * WORKING is the default state when the task is created.
 * WAITING is when the task/workflow is a sleep waiting for data input.
 * COMPLETED is when the task has completed ( whatever the result, @see TaskResult )
 */
export enum TaskStatus {
    WORKING,   
    WAITING,
    COMPLETED,
}

/**
 * TaskResult defines if and what the result of the task was.
 * PENDING result not achieved,   
 * SUCCEEDED an expected succeeded result,
 * FAILED an expected failed result,
 * ERROR an unexpected failed result,
 */
export enum TaskResult {
    PENDING,   
    SUCCEEDED,
    FAILED,
    ERROR,
}


export interface Task {

    getFlowClass(): T_ClassName;
    getFlowInstance(): T_Instance;

    getDataMap(): DataMap;

    getStatus(): TaskStatus;
    getResult(): TaskResult;
    
}

