/**
 * 
 * @author riyaz.mansoor@gmail.com
 * @modified 20230901
 */



/**
 * Abstract top level error class for this project.
 * Handles the manual prototype adjustment to the created class. 
 */
export abstract class ProjectError extends Error {

    constructor(msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, new.target.prototype);
    }

}  

export class KeyNotFound extends ProjectError {

    constructor(key: string, obj: string = "DataMap") {
        super(`Key [${key}] NOT found in object [${obj}]`);
    }

}
