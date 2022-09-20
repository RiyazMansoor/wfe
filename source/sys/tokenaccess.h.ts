/**
 * A sub-system to interact with secured systems without logging in,
 * using a single use access token as authentication.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20220920 v0.1
 */


import { T_IndId, T_HTML, T_Timestamp, T_Token, T_DataObject } from "./types.h";
import { I_RandomString } from "./util.h";


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
interface I_TokenExecuter {

    /**
     * The method that will be called upon the submission of a valid token.
     * This method will be implemented within the class @tokenExecuter implementation.
     * @param userDecision The decision (button clicked) by the user.
     * @param dataObject The pre-prepared data object (during token creation).
     */
    tokenExecute(userDecision: E_Decision, dataObject: T_DataObject): void;

}

/**
 * Describes the properties of the T_SingleUseToken, required when creation.
 * @createdAt The token creation timestamp.
 * @createdFor The specific individual the token is targetted at.
 * @detail The long explanation of token. Used in the decision form.
 * @dataObject The key parameters needed to process the user decision.
 * @userDecisions Array of possible decisions user can make.
 */
type T_SingleUseToken = {
    token: T_Token,
    createdAt: T_Timestamp,
    createdFor: T_IndId,
    detail: T_HTML,
    dataObject: T_DataObject,
    decisionExecutor: I_TokenExecuter,
    decisionChoices: E_Decision[],
    decision: {
        decidedAt: T_Timestamp,
        decidedBy: T_IndId,
        decisionChoice: E_Decision,
    }
}

/**
 * Describtes the properties of the token consumer.
 * @consumedBy The specific individual who consumed the token.
 * @userDecision The decision taken by the individual.
 */
type T_SingleUseTokenConsumer = {
    token: T_Token,
}

/**
 * 
 */
type T_SingleUseToken = {
    tokenProperties: T_SingleUseTokenCreated,
    // filled on submission
    tokenConsumer: T_SingleUseTokenConsumer
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
     * it is up to the ui to display the appropriate information.
     * @see submit
     * @param token The unique single use access token.
     * @return The matching data structure.
     */
    get(token: T_Token): T_SingleUseToken;

    /**
     * Accepts a users decision, authenticated via the single use access token.
     * A consumed token will not be processed - will return false.
     * A successful token validation will create a new instance of @tokenAction class
     * and call the @tokenExecute method with @decision and @dataObject parameters.
     * @note Does NOT enforce @createdFor and @consumedBy to be same.
     * @param token The unique single use access token.
     * @param decision The decision button the user clicked.
     * @return true if token was submitted successfully.
     */
    submit(token: T_Token, decision: E_Decision): boolean;

}


interface I_SingleUseToken extends I_RandomString {

    create(createdFor: T_IndId, message: T_HTML, buttons: E_Decision[], data: T_DataObject, tokenExecutor: I_TokenExecuter): T_SingleUseToken;


}