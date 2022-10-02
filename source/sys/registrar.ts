/**
 * Generic implementation of a class registration system.
 * Registered classes can be later retrieved via the key used to register them.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20221020
 */


import { T_ClassName } from "./types";


/**
 * The base interface for the class to register.
 * Business methods must be added to extending interfaces.
 */
export interface I_Class {

    /**
     * @returns The unique identifier for this registration - the class name.
     */
    getId(): T_ClassName;

}

/**
 * The abstract base class for registered classes.
 * Business methods must be added to extending classes.
 */
export abstract class AbstractInstance implements I_Class {

    getId(): T_ClassName {
        return this.constructor.name;
    }

}


/**
 * The interface for a (singleton) registry of classes.
 */
export interface I_InstanceRegistrar<I_ExtendedClass extends I_Class> {

    /**
     * @param clazz The class to register.
     */
    register(clazz: I_ExtendedClass): void;

    /**
     * @param clazzId The class name (unique id) of the registration.
     * @throws If matching registration is NOT found.
     * @return The matching registration.
     */
    get(clazzId: T_ClassName): I_ExtendedClass;

}

/**
 * The abstract base class for a generic registry of 'instances'.
 * Extending concrete class must implement the singleton structure.
 */
export abstract class AbstractClassRegistrar<I_ExtendedClass extends I_Class> implements I_InstanceRegistrar<I_ExtendedClass> {

    private registered: Map<T_ClassName, I_ExtendedClass> = new Map();

    register(clazz: I_ExtendedClass): void {
        this.registered.set(clazz.getId(), clazz);
    }

    get(clazz: T_ClassName): I_ExtendedClass {
        const I_ExtendedClass = this.registered.get(clazz);
        if (!I_ExtendedClass) {
            throw `NO registration for id=${clazz}`;
        }
        return I_ExtendedClass;
    }

}
