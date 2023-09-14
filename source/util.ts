
import { ProjectError } from "./errors";
import { Datum, BusinessData } from "./model";


/**
 * Returns a random string in base 36.
 * @param len Length of the random string ( default = 24 ) to return
 */
export function randomId( len: number = 24 ) : string {
    let id : string = "" ;
    while ( id.length < len ) {
        id += Math.random().toString( 36 ).substring( 2 ) ; 
    }
    return id.substring( 0, len ) ;
}

export function timeString() : string {
    return new Date().toISOString().replace( /\D/g, "" ) ;
}


export function jsonOwnProperty(ob: BusinessData, jsonPath: string): boolean {
    let currentObject: BusinessData = jsonObject;
    let keys = jsonPath.split(".");
    for (let i = 0; i < (keys.length - 2); i++ ) {
        if (!currentObject.hasOwnProperty(keys[i])) return false;
        currentObject = currentObject[keys[i]] as BusinessData; // TODO error here
    }
    return currentObject.hasOwnProperty(keys[i]);
}

export function jsonValue(jsonObject: BusinessData, jsonPath: string): Datum {
    let currentObject: BusinessData = jsonObject;
    let keys = jsonPath.split(".");
    for (let i = 0; i < (keys.length - 2); i++ ) {
        if (currentObject.hasOwnProperty(keys[i])) {
            currentObject = currentObject[keys[i]] as BusinessData;
        } else {
            let msg = `JSON Path [${jsonPath}] not found on Object [${JSON.stringify(jsonObject)}]`;
            throw new ProjectError(msg);
        }
    }
    return currentObject[keys[keys.length-1]]; 
}
