
/**
 * Type for Datetime timestamp - representated as ISO string with timezone.
 */
export type T_Timestamp = string ;

 /**
 * Uinque identifiers for individuals.
 */
export type T_IndId = string ;

/**
 * Unique identifiers for organizations.
 */
export type T_OrgId = string ;

/**
 * Services can be requested on an individual basis or on behalf of an organization.
 */
export type T_ServiceClientId = T_IndId | T_OrgId ;

/**
 * Unique identifiers for entity kinds.
 */
export type T_EntityKind = string ;

/**
 * Unique identifiers for entities.
 */
export type T_EntityId = string ;

/**
 * HTML text.
 */
export type T_HTML = string ;

/**
 * A url.
 */
export type T_URL = string ;

 /**
 * A random string used as an access token.
 */
export type T_Token = string ;

/**
 * Authorization roles. By convention role specializations are separated by a dash "-".
 */
export type T_RoleKey = string ;

/**
 * Fundamentally, all data in this sytem will be either string or number.
 */
export type T_DataType = string | number ;

/**
 * A container object for data. 
 * Keys can be any string. Can be any depth.
 */
export type T_DataObject = {
    [index: string]: T_DataType | T_DataObject
} 

export enum E_Button {
    ACCEPT, REJECT
}


