/**
 * 
 * @author riyaz.mansoor@gmail.com
 * @modified 20230901
 */



/**
 * General error for when expected property is NOT found in object.
 */
export class KeyNotInObject extends Error {

    /**
     * Key or property NOT found in object.
     */
    protected key: string;

    /**
     * Descriptive name of object in which key was NOT found.
     */
    protected objName: string;

    /**
     * Constructor.
     * @param key property that was NOT found in object
     * @param objName descriptive name of object in which key was NOT found
     */
    constructor(key: string, objName: string) {
        super(`Key NOT in Object :: key=${key} objName=${objName}`);
        this.key = key;
        this.objName = objName;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * Key or property that was NOT found in object
     * @returns key or property that was NOT found in object.
     */
    getKey(): string {
        return this.key;
    }

    /**
     * Descriptive name of object in which key was NOT found.
     * @returns descriptive name of object
     */
    getObjName(): string {
        return this.objName;
    }
}

/**
 * Generic class for cache miss errors.
 * 
 * @see controller.ts for cache design/implementations.
 */
export class NotInCacheError<C_Id, I_Id> extends Error {

    /**
     * Descriptive name of the cache in which the expected object was NOT found.
     */
    protected cacheName: string;

    /**
     * <code>ClassId</code> of the expected object NOT found in cache.
     */
    protected classId: C_Id;

    /**
     * <code>InstanceId</code> of the expected object NOT found in cache.
     */
    protected instanceId: I_Id;

    /**
     * Constructor.
     * An <code>Error</code> instance when expected object is NOT found in cache.
     * @param cacheName descriptive name of the cache
     * @param classId <code>classId</code> of the object in cache
     * @param instanceId  <code>instanceId</code> of the object in cache
     */
    constructor(cacheName: string, classId: C_Id, instanceId: I_Id) {
        super(`Object NOT in Cache Error :: cache=${cacheName} classId=${classId} instanceId=${instanceId}`);
        this.cacheName = cacheName;
        this.classId = classId;
        this.instanceId = instanceId;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * Returns the descriptive name of the cache in which the expected object was NOT found.
     * @returns descriptive name of the cache.
     */
    getCacheName(): string {
        return this.cacheName;
    }

    /**
     * Returns the <code>ClassId</code> of the expected object NOT found in cache.
     * @returns <code>ClassId</code> of the expected object.
     */
    getClassId(): C_Id {
        return this.classId;
    }

    /**
     * Returns the <code>InstanceId</code> of the expected object NOT found in cache.
     * @returns <code>InstanceId</code> of the expected object.
     */
    getInstanceId(): I_Id {
        return this.instanceId;
    }
    
}
