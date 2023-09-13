/**
 * 
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20230901
 */


// X -> G | GO | GA

type F = () => boolean;
type F_OR = F[];
type F_AND = F[];
type ConOR = (F|F_AND)[];
type ConAND = (F|F_OR)[];
type LogicOrAnd = F|ConOR|ConAND;


type GuardTree = {
    guard: Guard,
    orGuards: GuardTree,
    andGuards: GuardTree
}

class CustomType<T> {

    readonly type: string;
    readonly objects: T[];

    constructor(type: string, objects: T[]) {
        this.type = type;
        this.objects = objects;
    }


}


import { KeyNotFound } from "./errors";
import { DataMap, StrNum } from "./types";


export type DValue = string | number ;


/**
 * Supported functions to check logical results on data
 */
export enum GOps { LT, LTE, GT, GTE } ;

/**
 * Parameter may refer to a key in the data dictionary or a literal value.
 */
export type GParam = { type: "KEY" | "VALUE", param: string } ;

/**
 * Guard contains a operator function and the parameters that go into it.
 */
export type Guard = { guard: GOps, gparam: GParam[] } ;

export interface Guards { type: "OR" | "AND", guards: Guard[] }


/**
 * Executes a single guard and returns the result.
 * 
 * @param guard the check condition to be applied
 * @param dataMap data dictionary upon which the guard is applied
 * @returns true if the guard condition passed
 */
function ExecGuard(guard: Guard, dataMap: DataMap) : boolean {
    const errs: KeyNotFound[] = [];
    const vals: StrNum[] = [];
    for (const key of keys) {
        if (typeof key === "number") {
            vals.push(key);   
        } else if (!(key in dataMap)) {
            errs.push(new KeyNotFound(key));
        } else {
            vals.push(dataMap[key]);
        }
    }
    if (errs.length > 0) throw errs;
    switch (guard) {
        case GOps.LT: 
            const HasNull = vals.some((val) => val == null);
            if (HasNull) return false;
            const HasStrs = vals.filter((val) => typeof val === "string");
            if (HasNull) return false;
            if (vals[0] == null || vals[1] == null) return false; 
            return vals[0] < vals[1];
        default:
            return false;
    }
}


function execAndGuards( guards: Guard[], dataMap: DataMap ) : boolean {
    return guards.every( ( g ) => ExecGuard( g, dataMap ) ) ;
}

function execOrGuards( guards: Guard[], dataMap: DataMap ) : boolean {
    return guards.some( ( g ) => ExecGuard( g, dataMap ) ) ;
}

export function execGuards( guard: Guard | Guards, dataMap: DataMap ) : boolean {
    if ( guard instanceof Guards ) {

    }
}
