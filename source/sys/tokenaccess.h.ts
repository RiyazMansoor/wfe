/**
 * A sub-system to interact with secured systems without logging in,
 * using a single use access token as authentication.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20220920 v0.1
 */



import { T_Entity } from "./store";
import { T_IndId, T_HTML, T_Timestamp, T_DataObject } from "./types";



/**
* A random string used as an access token.
*/
type T_TokenId = string;

/**
 * Unique identifier for each token business implementation
 */
type T_TokenImplementorId = string;

/**
 * Decisions the user can make based on the context.
 */
enum E_TokenAction {
    ACCEPT = "ACCEPT", REJECT = "REJECT"
}


/**
 * Describes the properties of a single use token.
 * A token has standard properties required at creation, and other properties when the it is consumed.
 * @tokenId The single use access token.
 * @exprity The expiry time of this token if no action taken.
 * @createdAt The token creation timestamp.
 * @createdFor The specific individual the token is targetted at.
 * @detail The long explanation of token. Used in the decision form.
 * @data The key parameters needed to process the user decision.
 * @tokenImplementorId 
 * @tokenActions Array of possible token actions user can make.
 * @TokenConsumed Records the decision made by the user of token.
 *      @at The token consumption timestamp.
 *      @by The specific individual who consumed the token.
 *      @decision The decision taken by the individual.
 */
type T_Token = {
    tokenId: T_TokenId,
    expiry: T_Timestamp,
    createdAt: T_Timestamp,
    createdFor: T_IndId,
    detail: T_HTML,
    data: T_DataObject,
    tokenImplementorId: T_TokenImplementorId,
    tokenActions: E_TokenAction[],
    tokenConsumed: {
        at: T_Timestamp,
        by: T_IndId,
        decision: E_TokenAction,
    }
}

/**
 * The API interface to interact with the system without logging in,
 * using the a one time usable access token.
 * @see T_Token
 */
interface API_Token {

    /**
     * Creates a new token for the supplied parameters.
     * @see T_Token for parameter descriptions.
     * @returns The Id of the token created.
     */
    createToken(createdFor: T_IndId, detail: T_HTML, data: T_DataObject,
        tokenImplementorId: T_TokenImplementorId, tokenActions: E_TokenAction[]): T_TokenId;

    /**
     * Returns the token properties, even if expired or consumed. 
     * @see T_Token for parameter descriptions
     * @see T_Entity 
     */
    fetchToken(tokenId: T_TokenId): T_Entity;


    /**
     * Submits a users decision with matching token.
     * A successful token validation will the matching business logic.
     * @note Does NOT enforce @createdFor and @tokenConsumedBy to be same.
     * @see T_Token for parameter descriptions.
     * @throws If the token has expired or already been consumed.
     * @return true if token was consumed successfully.
     */
    submitToken(tokenId: T_TokenId, decision: E_TokenAction): boolean;

}




/**
 * The interface that will be implemented to execute user decisions 
 * upon the submission of a valid token.
 */
export interface I_TokenImplementor {

    /**
     * This method is used to match a token to its matching I_TokenExecuter implementation.
     * Be default uses the class name of the instance class.
     * @returns The unique identifier for this token decision executor.
     */
    getId(): T_TokenImplementorId;

    /**
     * This method will be called upon the submission of a valid token, 
     * on the matching registered I_TokenExecuter implementation.
     * @param decision The decision (button clicked) by the user.
     * @param data The pre-prepared data object (during token creation).
     */
    execute(decision: E_TokenAction, data: T_DataObject): void;

}

/**
 * Default abstract base class for I_TokenExecutor implementations.
 * The business logic of the user decision must be implemented in concrete classes.
 */
export abstract class AbstractTokenExecutor implements I_TokenImplementor {

    getId(): T_TokenImplementorId {
        return this.constructor.name;
    }

    abstract execute(decision: E_TokenAction, data: T_DataObject): void;

}


/**
 * The interface for a (singleton) global register of all I_TokenDecisionExecuter implementations.
 * Whenever a user successfully submits a token, the matching executor is fetched and executed. 
 */
export interface I_TokenImplementorRegister {

    /**
     * Registers implementations to their unique T_TokenExecutorId.
     * @see getTokenImplementor()
     * @param tokenExecutor The I_TokenExecuter implementation to register.
     */
    registerTokenImplementor(tokenImplementor: I_TokenImplementor): void;

    /**
     * @param tokenImplementorId The unique id of the token implementation.
     * @return The matching token implementation.
     */
    getTokenImplementor(tokenImplementorId: T_TokenImplementorId): I_TokenImplementor;

}

/**
 * Singleton token executor register
 */
export class TokenExecutorRegister implements I_TokenImplementorRegister {

    private static instance: TokenExecutorRegister;

    private registered: Map<T_TokenImplementorId, I_TokenImplementor> = new Map();

    private constructor() {
        // empty private constructor for singleton
    }

    /**
     * @returns Singleton instance of this class.
     */
    static getInstance(): TokenExecutorRegister {
        if (!TokenExecutorRegister.instance) {
            TokenExecutorRegister.instance = new TokenExecutorRegister();
        }
        return TokenExecutorRegister.instance;
    }

    registerTokenImplementor(tokenExecutor: I_TokenImplementor): void {
        this.registered.set(tokenExecutor.getId(), tokenExecutor);
    }

    getTokenImplementor(executorId: string): I_TokenImplementor {
        const implementor = this.registered.get(executorId);
        if (!implementor) {
            throw `NO token implementator registered for id=${executorId}`;
        }
        return implementor;
    }

}



/**
 * The interface to create a single use access token.
 * The implementation will be a singleton pattern.
 * @see T_Token
 */
export interface I_TokenRegister {

    /**
     * Creates and returns a single use access token.
     * By default, if token is not consumed for 3 days, it is blocked.
     * @param createdFor The specific individual the token is targetted at.
     * @param detail The explanation displayed to the user.
     * @param data The parameters needed to process the user decision.
     * @param tokenExecutor The code to be executed when a token decision is made by user.
     * @param tokenActions Array of possible decisions user can make.
     * @returns The created single use access token. 
     */
    registerToken(createdFor: T_IndId, detail: T_HTML, data: T_DataObject, tokenExecutor: I_TokenImplementor, tokenActions: E_TokenAction[]): T_TokenId;

    /**
     * @param tokenId The unique token id T_TokenId.
     * @return The matching token T_Token from the register.
     */
    getToken(tokenId: T_TokenId): T_Token;

}


////// Implementations 




export class TokenRegister implements I_TokenRegister {

    private static instance: TokenRegister;

    private constructor() {

    }

    static getInstance(): TokenRegister {
        if (!TokenRegister.instance) {
            TokenRegister.instance = new TokenRegister();
        }
        return TokenRegister.instance;
    }

    registerToken(createdFor: T_IndId, detail: string, data: T_DataObject, tokenExecutor: I_TokenImplementor, tokenActions: E_TokenAction[]): T_TokenId {
        throw new Error("Method not implemented.");
    }

    getToken(tokenId: string): T_Token {
        const token = MEM_F_Read("token", tokenId);
        if (!token) {
            throw `NOT found - TokenId=${tokenId}`;
        }
        return token as T_Token;
    }


}

