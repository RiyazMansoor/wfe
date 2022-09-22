
import { T_DataObject, T_DataType, T_EntityId, T_EntityKind } from "./types.h";

type F_Read = (kind: T_EntityKind, id: T_EntityId) => T_DataObject | undefined;

type F_Write = (kind: T_EntityKind, id: T_EntityId, T_DataObject) => void;


////// implementation for in memory store

type MEM_IDDO = Map<T_EntityId, T_DataObject>;

const MEM_STORE: Map<T_EntityKind, MEM_IDDO> = new Map();

const MEM_F_Write: F_Write(kind: T_EntityKind, id: T_EntityId, data: T_DataObject) => {
    const iddata: 
}

const MEM_F_Read: F_Read = (kind: T_EntityKind, id: T_EntityId) => {
    return MEM_STORE.get(kind)?.get(id);
}

