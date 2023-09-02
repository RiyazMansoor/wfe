/**
 * 
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20230901
 */

import { KeyNotFound } from "./errors";
import { DataMap, StrNum } from "./types";

/**
 * Guard function names supported in this project
 */
export enum GUARDS  { LT, LTE, GT, GTE } ;


export function ExecGuard(guard: GUARDS, keys: StrNum[], dataMap: DataMap  ) : boolean {
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
        case GUARDS.LT: 
            if (vals[0] == null || vals[1] == null) return false; 
            return vals[0] < vals[1];
        default:
            return false;
    }
}



