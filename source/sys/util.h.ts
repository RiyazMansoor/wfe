/**
 * Common functions.
 * 
 * @author riyaz.mansoor@gmail.com
 * @created 20220920
 */

/**
 * Interface to creating random strings.
 */
export interface I_RandomString {

    /**
     * Returns a random alphanumeric string of supplied length.
     * @param length The length of the random string.
     * @return The random alphanumeric string.
     */
    randomString(length: 32): string ;

}