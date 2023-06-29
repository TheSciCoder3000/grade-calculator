import { random, getFirestoreFunctions } from "@Utilities/index";
import { FirebaseApp } from "firebase/app";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    DocumentSnapshot,
    DocumentData,
} from "firebase/firestore";

import {
    IUserDoc
     
} from "./TypesInterface"

/**
 * Firestore (Firebase Database) module
 * - functions to initialize the firestore when user is authenticated
 * - CRUD functions to add, update and delete data from the database
 */

/**
 * initialize the firestore and get access to the firestore-related functions
 * @param app instance of the FirebaseApp
 * @returns object containing all the firestore functions
 */
export function initializeFirestore(app: FirebaseApp) {
    // Get the Firestore Instance
    const db = getFirestore(app);
    const dbDocRef = (userUid: string) => doc(db, "users", userUid);

    /**
     * function that is called after the user signs up and creates an account
     * * Used only in sign up page
     * @param userUid
     * @returns
     */
    const createUserDb = async (userUid: string) => {
        const yearId = random(12);
        const semId = random(12);
        const termId = random(12);

        // initialize the User Doc Data
        let docData: IUserDoc = {
            userUid,
            years: [
                {
                    name: "1st Year",
                    id: yearId,
                    sems: [
                        {
                            id: semId,
                            name: "1st sem",
                        },
                    ],
                },
            ],
            subjects: [],
            terms: [
                {
                    name: "Grade",
                    id: termId,
                },
            ],
            columns: {
                overview: {
                    grades: [
                        {
                            id: random(12),
                            name: "Midterm",
                        },
                    ],
                    extra: [],
                },
                details: {
                    grades: [
                        {
                            id: random(12),
                            name: "Grade",
                        },
                    ],
                    extra: [],
                },
            },
        };

        return setDoc(dbDocRef(userUid), docData);
    };

    /**
     * used to fetch the user's data
     * ! currently has no use within the codebase, remove in the future
     * @param userId user's id
     * @returns a documnet snapshot
     */
    const fetchUserData = async (userId: string) => {
        return getDoc(doc(db, "users", userId));
    };

    /**
     * Creates an firestore event listener that listens to any changes within the document
     * * Only used in the firebase context wrapper when asynchronously updating the userData state
     * @param userId string containing the user's id
     * @param dbHandler a function that is triggered when changes occur in the document
     * @returns Unsubscribe method to remove the listener
     */
    const dbListener = (userId: string, dbHandler: (doc: DocumentSnapshot<DocumentData>) => unknown) => {
        let unsub = onSnapshot(doc(db, "users", userId), dbHandler);
        return unsub;
    };

    return {
        createUserDb,
        fetchUserData,
        dbListener,
        getFirestoreFunctions: getFirestoreFunctions(db),
    };
}
