/**
 * The database access system and the entities that get serialized and desrialized.
 * Comes with a mock inefficient memory database to check code against.
 * Production systems must use production databases for the store.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20221020 v0.1
 */

import { T_DataObject, T_DataType, T_DateRange, T_JsonStr } from "./types";


/**
 * Unique identifier for data store entity objects.
 */
export type T_CollectionId = string;

export type T_ObjectId = string;

/**
 * All data entities will carry its data in this type.
 * The property @kind is used to deserialize into the correcte entity.
 * The property @data contains all the business information of the entity.
 */
export type T_Entity = {
    collectionId: T_CollectionId,
    objectId: T_ObjectId,
    entityData: T_DataObject
}


/**
 * The base entity class that must be extended by all entity classes.
 */
export abstract class AbstractEntity {

    /**
     * @param entity The data for this entity.
     * @param keyNames The field names the uniquely identify the entity.
     */
    constructor(entity: T_Entity) {
        // empty constructor
    }

    /**
     * @see T_CollectionId
     * @returns The name of the instance class.
     */
    getEntityType(): T_CollectionId {
        return this.constructor.name;
    }

    /**
     * @returns The entity data structure as a JSON string.
     */
    protected abstract getEntityDataAsJsonStr(): T_JsonStr;

    /**
     * Default toJSON() method - to convert entities to plain JSON.
     * @returns A plain JSON object.
     */
    toJSON(): T_Entity {
        return {
            collectionId: this.getEntityType(),
            entityData: JSON.parse(this.getEntityDataAsJsonStr())
        };
    }

    dbInsert(): void {
        return DbConnections.getInstance().dbInsert(this.toJSON());
    }

    dbUpsert(): void {
        DbConnections.getInstance().dbUpsert(this.getUniqueIndexCriteria(), this.toJSON());
    }

}

/**
 * The interface of the singleton class that will register all entity objects and
 * create instances of the entity objects when required.
 */
export interface I_EntityRegister {

    /**
     * Registers the class type to a matching name T_Kind.
     * @param kind The name of the class type to be registered.
     * @param clazz The class which must have constructor which takes T_Entity
     */
    registerEntity(kind: T_CollectionId, clazz: new (entity: T_Entity) => AbstractEntity): void;

    /**
     * @param entity The entity data  to convert to entity object.
     * @return The  created matching entity object. 
     */
    newEntity(entity: T_Entity): AbstractEntity;

}

/**
 * The singleton register of entity objects.
 * And that which creates registered entity objects as per the entity data.
 */
export class EntityRegister implements I_EntityRegister {

    private static registrar: I_EntityRegister;

    private registered: Map<T_CollectionId, new (entity: T_Entity) => AbstractEntity> = new Map();

    private constructor() {
        // empty
    }

    /**
     * @returns The singleton entity register.
     */
    getInstance(): I_EntityRegister {
        if (!EntityRegister.registrar) {
            EntityRegister.registrar = new EntityRegister();
        }
        return EntityRegister.registrar;
    }

    registerEntity(kind: T_CollectionId, clazz: new (entity: T_Entity) => AbstractEntity): void {
        this.registered.set(kind, clazz);
    }

    newEntity(entity: T_Entity): AbstractEntity {
        const clazz = this.registered.get(entity.collectionId);
        if (!clazz) {
            throw `EntityRegister :: Entity Class=${entity.collectionId} is NOT Registered!`;
        }
        return new clazz(entity);
    }

}


export enum E_WhereCondition {
    EQ = "==",
    NEQ = "!=",
    GT = ">",
    GTEQ = ">=",
    LT = "<",
    LTEQ = "<="
}

export type T_Where {
    field: string,
    condition: E_WhereCondition,
    value: T_DataType
}

export function Where(field: string, condition: E_WhereCondition, value: T_DataType): T_Where {
    const where: T_Where = {
        field: field,
        condition: condition,
        value: value
    }
    return where;
}

}


/**
 * Primary interface to access the database layer.
 */
export interface I_Datastore {

    /**
     * @param criteria The search keys and values.
     * @param entityType The type of entity to search.
     * @return Array of matching entity data.
     */
    dbSearch(criteria: T_DbTypeCriteria, entityType: T_CollectionId): T_Entity[];

    /**
     * @param criteria The search keys and values.
     * @param entityType The type of entity to search.
     * @return Array of matching entity data that was deleted.
     */
    dbDelete(criteria: T_DbTypeCriteria, entityType: T_CollectionId): T_Entity[];

    /**
     * Updates matching data or inserts data.
     * @param criteria The search keys and values.
     * @param data The entity data to update or insert.
     * @return The deleted entities.
     */
    dbUpsert(criteria: T_DbTypeCriteria, data: T_Entity): T_Entity[];

    /**
     * Just inserts data.
     * @param data The entity data to update or insert.
     */
    dbInsert(data: T_Entity): void;

}

/**
 * Global DB connections configurator.
 */
export class DbConnections {

    private static dbcon: I_Datastore;

    private constructor() {

    }

    /**
     * TODO: should be selected by configuration - currently to stub MemoryDb.
     * @returns The datastore to read and write data.
     */
    static getInstance(): I_Datastore {
        if (!DbConnections.dbcon) {
            DbConnections.dbcon = MemoryDb.getInstance();
        }
        return DbConnections.dbcon;
    }

}




////// implementation for in memory store


export type F_DbFieldCriteria = (fldValue: T_DataType) => boolean;
export type T_DbTypeCriteria = {
    [index: string]: F_DbFieldCriteria
}

export class MemoryDb implements I_Datastore {

    private static db: I_Datastore;

    private MEMDB: Map<T_CollectionId, Set<T_JsonStr>> = new Map();

    private constructor() {

    }

    static getInstance(): I_Datastore {
        if (!MemoryDb.db) {
            MemoryDb.db = new MemoryDb();
        }
        return MemoryDb.db;
    }

    /**
     * @param criteria The properties to match.
     * @param data The data object being matched.
     * @returns true if the @keys values match that of the @data
     */
    private matches(criteria: T_DbTypeCriteria, data: T_JsonStr): boolean {
        const datum = JSON.parse(data);
        for (const [key, func] of Object.entries(criteria)) {
            if (!func(datum[key])) return false;
        }
        return true;
    }

    /**
     * @param entityType The type of the entity to search.
     * @throws If matching Set is not found.
     * @returns The matching Set of for @entityType
     */
    private getSet(entityType: T_CollectionId): Set<T_JsonStr> {
        const set = this.MEMDB.get(entityType);
        if (!set) {
            throw `MemoryDb :: Kind=${entityType} NOT Found!`;
        }
        return set;
    }

    /**
     * @param keys The properties to match.
     * @param set The Set to search data.
     * @returns Array of matching (string) data objects.
     */
    private getMatches(criteria: T_DbTypeCriteria, set: Set<T_JsonStr>): T_JsonStr[] {
        const result: T_JsonStr[] = [];
        for (const jsonStr of set) {
            if (this.matches(criteria, jsonStr)) {
                result.push(jsonStr);
            }
        }
        return result;
    }

    dbSearch(criteria: T_DbTypeCriteria, entityType: T_CollectionId): T_Entity[] {
        const set = this.getSet(entityType);
        const matches = this.getMatches(criteria, set);
        return matches.map(jsonStr => JSON.parse(jsonStr));
    }

    dbDelete(criteria: T_DbTypeCriteria, entityType: T_CollectionId): T_Entity[] {
        const set = this.getSet(entityType);
        const matches = this.getMatches(criteria, set);
        matches.forEach(jsonStr => set.delete(jsonStr));
        return matches.map(jsonStr => JSON.parse(jsonStr));
    }

    dbUpsert(criteria: T_DbTypeCriteria, data: T_Entity): T_Entity[] {
        const set = this.getSet(data.collectionId);
        const matches = this.getMatches(criteria, set);
        matches.forEach(jsonStr => set.delete(jsonStr));
        set.add(JSON.stringify(data));
        return matches;
    }

    dbInsert(data: T_Entity): void {
        const set = this.getSet(data.collectionId);
        set.add(JSON.stringify(data));
    }

}

////// Of type F_DbFieldCriteria - specifically for stub MemoryDb

export type FieldCriteria = Map<string, string | number>;

export function dbUniqueCriteria(requirements: FieldCriteria): T_DbTypeCriteria {
    const criteria: T_DbTypeCriteria = {}
    for (const [key, value] of requirements.entries()) {
        criteria[key] = dbFieldCriteriaEqual(value);
    }
    return criteria;
}


/**
 * @param dateRange The date range to fall within.
 * @returns Date range within criterion function for the supplied @dateRange
 */
export function dbFieldCriteriaDateRangeIn(dateRange: T_DateRange): F_DbFieldCriteria {
    const dateFrom: Date = new Date(dateRange.from);
    const dateTo: Date = new Date(dateRange.to);
    return (value: T_DataType) => {
        const dateTest = new Date(value);
        return dateFrom <= dateTest && dateTest <= dateTo;
    }
}

/**
 * @param dateRange The date range to fall without.
 * @returns Date range without criterion function for the supplied @dateRange
 */
export function dbFieldCriteriaDateRangeNotIn(dateRange: T_DateRange): F_DbFieldCriteria {
    const func = dbFieldCriteriaDateRangeIn(dateRange);
    return (value: T_DataType) => {
        return !func(value);
    }
}

/**
 * @param baseValue The value to check equality.
 * @returns Equality criterion function for the supplied @baseValue
 */
export function dbFieldCriteriaEqual(baseValue: T_DataType): F_DbFieldCriteria {
    return (value: T_DataType) => {
        return value === baseValue;
    }
}


