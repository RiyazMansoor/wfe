
import { T_DataObject } from "./types.h";


/**
 * Unique identifiers for data store entity kinds.
 */
export type T_Kind = string;
  
/**
 * Storage type - a valid JSON string.
 */ 
export type T_JsonStr = string;

/**
 * All data entities will carry its data in this type.
 */
export type T_Entity = {
    kind: T_Kind,
    data?: T_DataObject
}



/**
 * Primary interface for all object/entities that must be written to the datastore.
 */
export interface I_Entity {

    /**
     * @returns The 'kind' of the object (similar to table).
     */
    getKind(): T_Kind;

    /**
     * Default toJSON() method - to do Typescript to plain JSON conversions.
     * @returns A plain JSON object for serialization.
     */
    toJSON(): T_DataObject;

}

export class AbstractEntity implements I_Entity {

    constructor(entity: T_Entity) {
        // empty constructor
        console.log(entity);
    }

    getKind(): T_Kind {
        return this.constructor.name;
    }

    toJSON(): T_Entity {
        return { "kind": this.getKind() };
    }


}


export interface I_EntityRegister {

    registerEntity(kind: T_Kind, clazz: new (entity:T_Entity) => AbstractEntity): void;

    newEntity(entity: T_Entity): AbstractEntity;

}

export class EntityRegister implements I_EntityRegister {

    private static registrar: EntityRegister;

    private registered: Map<T_Kind, new (entity:T_Entity) => AbstractEntity> = new Map();

    private constructor() {
        // empty
    }

    getInstance(): EntityRegister {
        if (!EntityRegister.registrar) {
            EntityRegister.registrar = new EntityRegister();
        }
        return EntityRegister.registrar;
    }
    
    registerEntity(kind: T_Kind, clazz: new (entity: T_Entity) => AbstractEntity): void {
        this.registered.set(kind, clazz);
    }

    newEntity(entity: T_Entity): AbstractEntity {
        const clazz = this.registered.get(entity.kind);
        if (!clazz) {
            throw `EntityRegister :: Entity Class=${entity.kind} is NOT Registered!`;
        }
        return new clazz(entity);
    }

}


/**
 * Primary interface to access the database layer.
 */
export interface I_Datastore {

    dbSearch(kind: T_Kind, keys: T_DataObject): T_DataObject[];

    dbDelete(kind: T_Kind, keys: T_DataObject): T_DataObject[];

    dbUpsert(keys: T_DataObject, data: T_Entity): void;

}





////// implementation for in memory store

export class MemoryDb implements I_Datastore {

    private static db: I_Datastore;

    private MEMDB: Map<T_Kind, Set<T_JsonStr>> = new Map();

    private constructor() {

    }

    getInstance(): I_Datastore {
        if (!MemoryDb.db) {
            MemoryDb.db = new MemoryDb();
        }
        return MemoryDb.db;
    }

    hasKeys(keys: T_DataObject, data: T_JsonStr): boolean {
        const datum = JSON.parse(data);
        for (const [key, value] of Object.entries(keys)) {
            if (datum[key] != value) return false;
        }
        return true;
    }

    getSet(kind: T_Kind): Set<T_JsonStr> {
        const set = this.MEMDB.get(kind);
        if (!set) {
            throw `mem_db :: Kind=${kind} NOT Found!`;
        }
        return set;
    }

    getMatches(keys: T_DataObject, set: Set<T_JsonStr>): T_JsonStr[] {
        const result: T_JsonStr[] = [];
        for (const jsonStr of set) {
            if (this.hasKeys(keys, jsonStr)) {
                result.push(jsonStr);
            }
        }
        return result;
    }

    dbSearch(kind: T_Kind, keys: T_DataObject): T_DataObject[] {
        const set = this.getSet(kind);
        const matches = this.getMatches(keys, set);
        return matches.map(jsonStr => JSON.parse(jsonStr));
    }

    dbDelete(kind: T_Kind, keys: T_DataObject): T_DataObject[] {
        const set = this.getSet(kind);
        const matches = this.getMatches(keys, set);
        matches.forEach(jsonStr => set.delete(jsonStr));
        return matches.map(jsonStr => JSON.parse(jsonStr));
    }

    dbUpsert(keys: T_DataObject, data: T_Entity): void {
        const set = this.getSet(data.kind);
        const matches = this.getMatches(keys, set);
        matches.forEach(jsonStr => set.delete(jsonStr));
        set.add(JSON.stringify(data));
    }


}


