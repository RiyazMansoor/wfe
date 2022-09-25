/**
 * A sub-system to interact with secured systems without logging in,
 * using a single use access token as authentication.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20220920 v0.1
 */



import { T_IndId, T_HTML, T_Timestamp, T_DataObject } from "./types.h" ;
import { randomString, timestamp } from "./util.h" ;
import { MEM_F_Write, MEM_F_Read } from "./store" ;

/**
* A random string used as an access token.
*/
export type T_TokenId = string;

/**
 * Id to uniquely identify each I_TokenDecisionExecutor
 */
export type T_TokenExecutorId = string ;

/**
 * Decisions the user can make based on the context.
 */
export enum E_TokenAction {
    ACCEPT = "ACCEPT", REJECT = "ACCEPT"
}


/**
 * The interface that will be implemented to execute user decisions upon the submission of a valid token.
 */
export interface I_TokenExecuter {

    /**
     * This method is used to match a token to its matching I_TokenExecuter implementation.
     * @returns The unique identifier for this token decision executor.
     */
    executorId() : T_TokenExecutorId ;

    /**
     * This method will be called upon the submission of a valid token, 
     * on the matching registered I_TokenExecuter implementation.
     * @param decision The decision (button clicked) by the user.
     * @param data The pre-prepared data object (during token creation).
     */
    execute( decision: E_TokenAction, data: T_DataObject ): void;

}

/**
 * The interface for a (singleton) global register of all I_TokenDecisionExecuter implementations.
 * Whenever a user successfully submits a token, the matching executor is fetched and executed. 
 */
export interface I_TokenExecuterRegister {

    /**
     * Registers I_TokenDecisionExecuter implementations to their unique T_TokenExecutorId.
     * @see getExecutor()
     * @param tokenExecutor The I_TokenExecuter implementation to register.
     */
    registerExecutor( tokenExecutor: I_TokenExecuter ): void ;

    /**
     * @param executorId The unique T_TokenExecutorId of the I_TokenExecuter to return.
     * @return The matching I_TokenExecuter implementation.
     */
    getExecutor( executorId: T_TokenExecutorId ): I_TokenExecuter ;

}


/**
 * Describes the properties of a single use token T_SingleUseToken.
 * The token properties required when creation and the properties when the it is consumed.
 * @tokenId The single use access token.
 * @exprity The expiry time of this token if no action taken.
 * @createdAt The token creation timestamp.
 * @createdFor The specific individual the token is targetted at.
 * @detail The long explanation of token. Used in the decision form.
 * @data The key parameters needed to process the user decision.
 * @tokenExecutorId The unique id of the executor.
 * @tokenActions Array of possible token actions user can make.
 * @consumed Records the decision made by the user of token.
 *      @at The token consumption timestamp.
 *      @by The specific individual who consumed the token.
 *      @userAction The decision taken by the individual.
 */
type T_Token = {
    tokenId: T_TokenId,
    expiry: T_Timestamp,
    createdAt: T_Timestamp,
    createdFor: T_IndId,
    detail: T_HTML,
    data: T_DataObject,
    tokenExecutorId: T_TokenExecutorId,
    tokenActions: E_TokenAction[],
    consumed: {
        at: T_Timestamp,
        by: T_IndId,
        userAction: E_TokenAction,
    }
}

/**
 * The API interface to interact with the system without logging in,
 * using the a one time usable access token.
 * @see T_Token
 */
interface API_SingleUseToken {

    /**
     * Accepts a users decision, authenticated via the single use access token.
     * A successful token validation will create a new instance of @decisionExecutor class
     * and call the @tokenExecute method with @decisionChoice and @dataObject parameters.
     * @note Does NOT enforce @createdFor and @consumedBy to be same.
     * @throws If the token has already been consumed.
     * @param tokenId The unique single use access token.
     * @param userAction The decision made by the user (button clicked).
     * @return true if token was submitted/consumed successfully.
     */
    submit(tokenId: T_TokenId, userAction: E_TokenAction): boolean;

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
    registerToken(createdFor: T_IndId, detail: T_HTML, data: T_DataObject, tokenExecutor: I_TokenExecuter, tokenActions: E_TokenAction[] ): T_TokenId ;

    /**
     * @param tokenId The unique token id T_TokenId.
     * @return The matching token T_Token from the register.
     */
    getToken(tokenId: T_TokenId): T_Token;

}



////// Implementations 

export class TokenExecutorRegister implements I_TokenExecuterRegister {

    private static instance: TokenExecutorRegister ;

    /**
     * @returns Singleton instance of TokenExecutorRegister.
     */
    static getInstance() : TokenExecutorRegister {
        if (!TokenExecutorRegister.instance) {
            TokenExecutorRegister.instance = new TokenExecutorRegister() ;
        }
        return TokenExecutorRegister.instance ;
    }

    private executors: Map<T_TokenExecutorId, I_TokenExecuter> = new Map() ;

    private constructor() {
        // empty private constructor for singleton
    }

    registerExecutor(tokenExecutor: I_TokenExecuter): void {
        this.executors.set(tokenExecutor.executorId(), tokenExecutor);
    }

    getExecutor(executorId: string): I_TokenExecuter {
        const executor = this.executors.get(executorId);
        if (!executor) {
            throw `NO I_TokenExecuter registered for id=${executorId}`;
        }
        return executor;
    }

}



export class TokenRegister implements I_TokenRegister {

    private static instance: TokenRegister ;

     static getInstance() : TokenRegister {
        if ( !TokenRegister.instance ) {
            TokenRegister.instance = new TokenRegister() ;
        }
        return TokenRegister.instance ;
    }

    private constructor() {
        
    }
    registerToken(createdFor: T_IndId, detail: string, data: T_DataObject, tokenExecutor: I_TokenExecuter, tokenActions: E_TokenAction[]): T_TokenId {
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

