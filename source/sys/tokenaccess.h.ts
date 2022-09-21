/**
 * A sub-system to interact with secured systems without logging in,
 * using a single use access token as authentication.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20220920 v0.1
 */


import { T_IndId, T_HTML, T_Timestamp, T_Token, T_DataObject } from "./types.h" ;
import { randomString, timestamp } from "./util.h" ;

/**
 * Decisions the user can make based on the context.
 */
enum E_Decision {
    ACCEPT, REJECT
}


/**
 * The interface that will be executed upon the submission of a valid token.
 * For every different decision the user is presented, a matching class
 * taking into account all possible decisions (decision buttons), must be implemented.
 */
interface I_TokenDecisionExecuter {

    /**
     * The method that will be called upon the submission of a valid token.
     * This method will be implemented within the class @tokenExecuter implementation.
     * @param decisionChoice The decision (button clicked) by the user.
     * @param dataObject The pre-prepared data object (during token creation).
     */
    tokenExecute(decisionChoice: E_Decision, dataObject: T_DataObject): void;

}

/**
 * Describes the properties of the T_SingleUseToken required when creation,
 * and the properties when the token is consumed.
 * @token The single use access token.
 * @createdAt The token creation timestamp.
 * @createdFor The specific individual the token is targetted at.
 * @detail The long explanation of token. Used in the decision form.
 * @dataObject The key parameters needed to process the user decision.
 * @decisionExecutor The code to be executed when a token decision is made by user.
 * @decisionChoices Array of possible decisions user can make.
 * @decision Records the decision made by the user of token
 *      @decidedAt The token consumption timestamp.
 *      @decidedBy The specific individual who consumed the token.
 *      @decisionChoice The decision taken by the individual.
 */
type T_SingleUseToken = {
    token: T_Token,
    createdAt: T_Timestamp,
    createdFor: T_IndId,
    detail: T_HTML,
    dataObject: T_DataObject,
    decisionExecutor: I_TokenDecisionExecuter,
    decisionChoices: E_Decision[],
    decision: {
        decidedAt: T_Timestamp,
        decidedBy: T_IndId,
        decisionChoice: E_Decision,
    }
}

/**
 * The API interface to interact with the system without logging in,
 * using the a one time usable access token.
 * @see T_SingleUseToken
 */
interface API_SingleUseToken {

    /**
     * Returns the matching token data structure.
     * A consumed token will also return the matching data structure,
     * it is up to the caller to take appropriate action.
     * @see submit
     * @param token The unique single use access token.
     * @return The matching data structure.
     */
    get(token: T_Token): T_SingleUseToken;

    /**
     * Accepts a users decision, authenticated via the single use access token.
     * A successful token validation will create a new instance of @decisionExecutor class
     * and call the @tokenExecute method with @decisionChoice and @dataObject parameters.
     * @note Does NOT enforce @createdFor and @consumedBy to be same.
     * @throws If the token has already been consumed.
     * @param token The unique single use access token.
     * @param decisionChoice The decision made by the user (button clicked).
     * @return true if token was submitted/consumed successfully.
     */
    submit(token: T_Token, decisionChoice: E_Decision): boolean;

}


/**
 * The interface to create a single use access token.
 * The implementation will be a singleton pattern.
 * @see T_SingleUseToken
 */
 export interface I_SingleUseToken {

    /**
     * Creates and returns a single use access token.
     * By default, if token is not consumed for 3 days, it is blocked.
     * @param createdFor The specific individual the token is targetted at.
     * @param detail The long explanation of token. Used in the decision form.
     * @param dataObject The key parameters needed to process the user decision.
     * @param decisionExecutor The code to be executed when a token decision is made by user.
     * @param decisionChoices Array of possible decisions user can make.
     * @returns The created single use access token. 
     */
    createToken(createdFor: T_IndId, detail: T_HTML, decisionChoices: E_Decision[], 
        dataObject: T_DataObject, decisionExecutor: I_TokenDecisionExecuter): T_SingleUseToken ;

}


export class SingleUsetoken implements I_SingleUseToken {

    private static instance: SingleUsetoken ;

    private constructor() {}

    static getInstance() : SingleUsetoken {
        if ( !SingleUsetoken.instance ) {
            SingleUsetoken.instance = new SingleUsetoken() ;
        }
        return SingleUsetoken.instance ;
    }

    createToken(createdFor: T_IndId, detail: string, decisionChoices: E_Decision[], dataObject: T_DataObject, decisionExecutor: I_TokenDecisionExecuter): T_SingleUseToken {
        const sut: T_SingleUseToken = {
            token: randomString(),
            createdAt: timestamp(),
            createdFor: createdFor,
            detail: detail,
            dataObject: dataObject,
            decisionExecutor: decisionExecutor,
            decisionChoices: decisionChoices,
            decision: {
                decidedAt: "",
                decidedBy: "",
                decisionChoice: E_Decision.REJECT
            }
        } ;
        // save token
        return sut ;
    }

}

function createToken(createdFor: T_IndId, detail: string, dataObject: T_DataObject, 
    decisionExecutor: I_TokenDecisionExecuter, decisionChoices: E_Decision[]): T_SingleUseToken {
    const sut: T_SingleUseToken = {
        token: randomString(),
        createdAt: timestamp(),
        createdFor: createdFor,
        detail: detail,
        dataObject: dataObject,
        decisionExecutor: decisionExecutor,
        decisionChoices: decisionChoices,
        decision: {
            decidedAt: "",
            decidedBy: "",
            decisionChoice: E_Decision.REJECT
        }
    } ;
    // save token
    return sut ;
}
