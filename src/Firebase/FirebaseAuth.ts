import { FirebaseApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    User,
    signOut,
    signInWithEmailAndPassword,
} from "firebase/auth";
import React from "react";

// ================================== Type Definitions ==================================
/**
 * initializes the firebase authentication and return an object containing all the auth-related functions such as:
 * - signing up
 * - logging in
 * - signing out
 * - status listener
 * @param app an instance of the FirebaseApp
 * @param createUserDb
 * @returns an object containing all the Authetication-related functions
 */
export function InitializeAuthentication(app: FirebaseApp) {
    const auth = getAuth(app);

    /**
     * creates an event listener that runs a dispatch function when changes occur
     * @param setUserStatus a dispatch function from a react state
     * @returns an UnSubscribe function
     */
    const AuthStatusListener = (setUserStatus: React.Dispatch<React.SetStateAction<User | null>>) =>
        auth.onAuthStateChanged((user) => setUserStatus(user));

    /**
     * used to create a user upon filling up the sign up form
     * @param email
     * @param password
     * @returns the user's credentials when successful or an error message when failure
     */
    const AuthSignUp = async (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential.user)
                return userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(`${errorCode}: ${errorMessage}`);
                return null;
            });
    };

    /**
     * used to sign out the current user
     * @returns a promise of the sign out procedure
     */
    const AuthSignOut = async () => {
        console.log("signing out");
        return signOut(auth);
    };

    /**
     * Logs in the user using ther email and password
     * @param email
     * @param password
     * @returns the user's credentials when successful or an error response when failure
     */
    const AuthLogIn = async (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                console.log("User has successfuly logged in");
                return userCredentials.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(`${errorCode}: ${errorMessage}`);
                return null;
            });
    };

    return { AuthSignUp, AuthLogIn, AuthSignOut, AuthStatusListener };
}
