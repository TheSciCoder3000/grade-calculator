export { getFirestoreFunctions } from './FirebaseUtils';
export { default as FormValidation } from "./FormValidation";

/**
 * uid generator
 * @param length  number of chars of the uid
 * @returns unique id string
 */
export const random = (length = 8) => Math.random().toString(16).substr(2, length);