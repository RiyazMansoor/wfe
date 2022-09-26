/**
 * A sub-system to interact with secured systems without logging in,
 * using a single use access token as authentication.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20220920 v0.1
 */



import { DbConnections, dbFieldCriteriaEqual, T_Entity, T_DbTypeCriteria, AbstractEntity } from "./store";
import { T_IndId, T_HTML, T_Timestamp, T_DataObject } from "./types";
import { executorId, timestamp } from "./util";



/**
* A random string used as an access token.
*/
type T_TokenId = string;

/**
 * Unique identifier for each token business implementation
 */
type T_TokenConsumerId = string;

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
 * @tokenConsumerId 
 * @tokenActions Array of possible token actions user can make.
 * @tokenConsumed true if token has been consumed. 
 * @consumed Records the decision made by the user of token.
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
    tokenConsumerId: T_TokenConsumerId,
    tokenActions: E_TokenAction[],
    tokenConsumed: boolean,
    consumed: {
        at: T_Timestamp,
        by: T_IndId,
        decision: E_TokenAction,
    }
}


/**
 * Entity class for a Log object.
 */
 export class TokenEntity extends AbstractEntity {

    private token: T_Token;

    constructor(entity: T_Entity) {
        super(entity);
        this.token = TokenEntity.toTypescript(entity.entityData);
    }

    static toTypescript(plainJSON: T_DataObject): T_Token {
        const consumed: T_DataObject = plainJSON.consumed as T_DataObject;
        const token: T_Token = {
            tokenId: plainJSON.tokenId as T_TokenId,
            expiry: plainJSON.expiry as T_Timestamp,
            createdAt: plainJSON.createdAt as T_Timestamp,
            createdFor: plainJSON.createdFor as T_IndId,
            detail:plainJSON.detail as T_HTML,
            data: plainJSON.data as T_DataObject,
            tokenConsumerId: plainJSON.createdFor as T_IndId,
            tokenActions: (plainJSON.tokenActions as string[]).map(a => E_TokenAction[a]),
            tokenConsumed: plainJSON.tokenConsumed as boolean,
            consumed: {
                at: consumed.at as T_Timestamp,
                by: consumed.by as T_IndId,
                decision: E_TokenAction[consumed.decision as string]
            }
        }
        return token;
    }

    consume(decision: E_TokenAction): void {
        this.token.tokenConsumed = true;
        this.token.consumed.at = timestamp(),
        this.token.consumed.by = executorId(),
        this.token.consumed.decision = decision;

        DbConnections.getInstance().dbUpsert(this.toJSON());
    }
    
    protected getEntityDataAsJsonStr(): string {
        return JSON.stringify(this.token);
    }

    protected getUniqueIndexCriteria(): T_DbTypeCriteria {
        const criteria: T_DbTypeCriteria = {
            tokenId: dbFieldCriteriaEqual(this.token.tokenId as string)
        }
        return criteria;
    }

}


/**
 * The interface that will be implemented to execute user decisions 
 * upon the submission of a valid token.
 */
 export interface I_TokenConsumer {

    /**
     * Be default uses the class name of the instance class.
     * @returns The unique identifier for this token consumer.
     */
    getId(): T_TokenConsumerId;

    /**
     * This method will be called upon the submission of a valid token, 
     * on the matching registered token Consumer.
     * @param decision The decision (button clicked) by the user.
     * @param data The pre-prepared data object (during token creation).
     * @return true if token successfully consumed.
     */
    consume(decision: E_TokenAction, data: T_DataObject): boolean;

}

/**
 * Default abstract base class for token consumer implementations.
 * The business logic of the user decision must be implemented in extending classes.
 */
export abstract class AbstractTokenConsumer implements I_TokenConsumer {

    getId(): T_TokenConsumerId {
        return this.constructor.name;
    }

    abstract consume(decision: E_TokenAction, data: T_DataObject): boolean;

}


/**
 * The interface for a (singleton) global register of all I_TokenDecisionExecuter implementations.
 * Whenever a user successfully submits a token, the matching executor is fetched and executed. 
 */
export interface I_TokenConsumerRegister {

    /**
     * Registers token implementations to their unique id.
     * @param tokenConsumer The token Consumer.
     */
    registerTokenConsumer(tokenConsumer: I_TokenConsumer): void;

    /**
     * @param tokenConsumerId The unique id of the token consumer implementation.
     * @throws If matching token consumer implementation is NOT found.
     * @return The matching token consumer implementation.
     */
    getTokenConsumer(tokenConsumerId: T_TokenConsumerId): I_TokenConsumer;

}

/**
 * Singleton registry of token Consumers.
 */
export class TokenConsumerRegister implements I_TokenConsumerRegister {

    private static instance: TokenConsumerRegister;

    private registered: Map<T_TokenConsumerId, I_TokenConsumer> = new Map();

    private constructor() {
        // empty private constructor for singleton
    }

    /**
     * @returns Singleton instance of this class.
     */
    static getInstance(): TokenConsumerRegister {
        if (!TokenConsumerRegister.instance) {
            TokenConsumerRegister.instance = new TokenConsumerRegister();
        }
        return TokenConsumerRegister.instance;
    }

    registerTokenConsumer(tokenConsumer: I_TokenConsumer): void {
        this.registered.set(tokenConsumer.getId(), tokenConsumer);
    }

    getTokenConsumer(tokenConsumerId: string): I_TokenConsumer {
        const Consumer = this.registered.get(tokenConsumerId);
        if (!Consumer) {
            throw `NO token consumer registered for id=${tokenConsumerId}`;
        }
        return Consumer;
    }

}

/**
 * The API interface to interact with the system without logging in,
 * using the a one time usable access token.
 * @see T_Token
 */
interface I_TokenAPI {

    /**
     * Creates a new token for the supplied parameters.
     * @see T_Token for parameter descriptions.
     * @returns The Id of the token created.
     */
    createToken(createdFor: T_IndId, detail: T_HTML, data: T_DataObject,
        tokenConsumerId: T_TokenConsumerId, tokenActions: E_TokenAction[]): T_TokenId;

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

export class MemoryDbTokenAPI implements I_TokenAPI {

    private static instance: I_TokenAPI;

    private constructor() {

    }

    static getInstance(): I_TokenAPI {
        if (!MemoryDbTokenAPI.instance) {
            MemoryDbTokenAPI.instance = new MemoryDbTokenAPI();
        }
        return MemoryDbTokenAPI.instance;
    }


    createToken(createdFor: T_IndId, detail: T_HTML, data: T_DataObject, tokenConsumerId: T_TokenConsumerId, tokenActions: E_TokenAction[]): T_TokenId {
        throw new Error("Method not implemented.");
    }

    fetchToken(tokenId: T_TokenId): T_Entity {
        const criteria: T_DbTypeCriteria = {
            tokenId: dbFieldCriteriaEqual(tokenId as string)
        }
        const entities: T_Entity[] = DbConnections.getInstance().dbSearch(criteria, TokenEntity.constructor.name);
        if (entities.length != 1) {
            throw new Error(`Matching tokens=${entities.length} for tokenId=${tokenId}`);
        }
        return entities[0];
    }

    submitToken(tokenId: T_TokenId, decision: E_TokenAction): boolean {
        const token: T_Token = TokenEntity.toTypescript(this.fetchToken(tokenId).entityData);
        if (new Date() > new Date(token.expiry)) {
            throw new Error(`RM: Token has expired.`);
        }
        if (token.tokenConsumed) {
            throw new Error(`RM: Token has been consumed by=${token.consumed.by} at=${token.consumed.at}.`);
        }
        const tokenConsumer = TokenConsumerRegister.getInstance().getTokenConsumer(tokenId);
        const consumed = tokenConsumer.consume(decision, token.data);
        if (consumed) {
            token.tokenConsumed = true;
            token.consumed.at = timestamp(),
            token.consumed.by = executorId(),
            token.consumed.decision = decision;

        }
        return consumed;
    }

}

