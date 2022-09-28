
import { T_ClassName } from "./types";

/**
 * The base interface for the registered item.
 * Business methods must be added to extending interfaces.
 */
export interface I_RegisterItem {

    /**
     * @returns The unique identifier for this registration.
     */
    getId(): T_ClassName;

}

/**
 * The abstract base class for registered items.
 * Business methods must be added to extending classes to implment the extended I_RegisterItem.
 */
export abstract class AbstractRegisterItem implements I_RegisterItem {

    getId(): T_ClassName {
        return this.constructor.name;
    }

}


/**
 * The interface for a (singleton) global register of all I_TokenDecisionExecuter implementations.
 * Whenever a user successfully submits a token, the matching executor is fetched and executed. 
 */
export interface I_Registrar<RI extends I_RegisterItem> {

    /**
     * @param registerItem The candidate to register.
     */
    register(registerItem: RI): void;

    /**
     * @param registerItemId The class name (unique id) of the registration.
     * @throws If matching registration is NOT found.
     * @return The matching registration.
     */
    get(registerItemId: T_ClassName): RI;

}

/**
 * Singleton registry of token Consumers.
 */
export abstract class AbstractRegistrar<RI extends I_RegisterItem> implements I_Registrar<RI> {

    private registered: Map<T_ClassName, RI> = new Map();

    register(registerItem: RI): void {
        this.registered.set(registerItem.getId(), registerItem);
    }

    get(registerItemId: T_ClassName): RI {
        const RI = this.registered.get(registerItemId);
        if (!RI) {
            throw `NO registration for id=${registerItemId}`;
        }
        return RI;
    }

}
