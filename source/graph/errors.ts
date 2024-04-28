

import { ProjectError } from "../errors";




export class NodeNotFound extends ProjectError {

    constructor(nodeName: string) {
        super(`Node [${nodeName}] does NOT Exists.`);
    }

}

export class NodeExists extends ProjectError {

    constructor(nodeName: string) {
        super(`Node [${nodeName}] Exists.`);
    }

}
