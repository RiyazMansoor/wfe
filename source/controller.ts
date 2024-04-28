import { Task, TaskClassId, TaskInstanceId, Workflow, WorkflowClassId, WorkflowInstanceId } from "./model"

type WorkflowCache = {
    [key: WorkflowClassId]: {
        [key: WorkflowInstanceId]: Workflow
    }
}

type TaskCache = {
    [key: TaskClassId]: {
        [key: TaskInstanceId]: Task
    }
}

class CachedWorkflows {

    private static instance: CachedWorkflows;
    private cache: WorkflowCache = {}

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): CachedWorkflows {
        if (!CachedWorkflows.instance) {
            CachedWorkflows.instance = new CachedWorkflows();
        }
        return CachedWorkflows.instance;
    }

    /**
     * Returns the matching workflow from cache. 
     * If not in cache, fetches from the db, caches it and then returns it.
     * @param workflowClassId
     * @param workflowInstanceId
     * @return cached Workflow instance
     */
    public getWorkflow(workflowClassId: WorkflowClassId, workflowInstanceId: WorkflowInstanceId): Workflow {
        if (!this.cache.hasOwnProperty(workflowClassId)) {
            this.cache[workflowClassId] = {};
        }
        if (!this.cache[workflowClassId].hasOwnProperty(workflowInstanceId)) {
            const workflowPromise = new Promise((resolve, reject) => {
                // write the fetch code from DB
            });
            workflowPromise
                .then((result) => this.cache[workflowClassId][workflowInstanceId] = result as Workflow)
                // .catch(handleNewResult);
            
        }
        return this.cache[workflowClassId][workflowInstanceId];
    }

    /**
     * Returns the matching workflow from cache. 
     * If not in cache, fetches from the db, caches it and then returns it.
     * @param workflowClassId
     * @param workflowInstanceId
     * @throws WorkflowCacheError
     */
    public saveWorkflow(workflowClassId: WorkflowClassId, workflowInstanceId: WorkflowInstanceId): Workflow {
        if (!this.cache[workflowClassId] || !this.cache[workflowClassId][workflowInstanceId]) {
            throw WorkflowCacheError(workflowClassId, workflowInstanceId);
        }
        const workflow: Workflow = this.cache[workflowClassId][workflowInstanceId];
        const workflowPromise = new Promise((resolve, reject) => {
            // write the fetch code from DB
        });
        workflowPromise
            .then((result) => this.cache[workflowClassId][workflowInstanceId] = result as Workflow)
            // .catch(handleNewResult);
    }

}