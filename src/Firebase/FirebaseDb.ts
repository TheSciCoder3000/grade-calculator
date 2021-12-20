import { getFirestore, doc, setDoc, getDoc, onSnapshot, Unsubscribe, query, collection, where } from 'firebase/firestore'
import { FirebaseApp } from 'firebase/app'
import React from 'react'


/**
 * Firestore (Firebase Database) module
 * - functions to initialize the firestore when user is authenticated
 * - CRUD functions to add, update and delete data from the database
 */


/**
 * interface schema of the data received from the firestore
 */
export interface IUserDoc {
    userUid: string
    subjects: ISubject[]                                                   // collection of user's subjects
    sems: string[]                                                         // array containing the semesters of the user
    terms: string[]                                                        // array containing the terms a semester has
}

/**
 * interface of the subject array property of the IUserDoc.
 * - `name:` Course Name
 * - `sem:` semester name
 * - `assessments:` array containing all the assessments of the subject
 * - - `name:` assessment name
 * - - `term:` the term of the sem in which the assessment is assigned
 * - - `grade:` the score/grade receivied after completing the assessment
 * - - `type:` the type/category in whcich the assessment falls in
 * - - `[x: string]:` other user-defined props that would be visible in the table
 */
export interface ISubject {
    name: string                                                           // coourse name
    sem: string                                                            // semester name (should be included inside the sems array)
    assessments: {
        name: string                                                       // Assessment name (ex. Enabling Assessment)
        term: string                                                       // term name (should be included inside the terms array)
        grade: number | null
        type: string                                                       // used to infer the type of assessment for a unified grading system
        [x: string]: string | number | null                                // other user-defined props for querying and organization
    }[]
}


/**
 * initialize the firestore and get access to the firestore-related functions
 * @param app instance of the FirebaseApp
 * @returns object containing all the firestore functions
 */
export function initializeFirestore(app: FirebaseApp) {
    // Get the Firestore Instance
    const db = getFirestore(app)
    const dbDocRef = (userUid: string) => doc(db, 'users', userUid)

    /**
     * function that is called after the user signs up and creates an account
     * @param userUid 
     * @returns 
     */
    const createUserDb = async (userUid: string) => {
        // initialize the User Doc Data
        let docData: IUserDoc = {
            userUid,
            subjects: [],
            sems: [] as string[],
            terms: [] as string[]
        }

        return setDoc(dbDocRef(userUid), docData)
    }

    /**
     * fetches data from the database
     * @param userUid 
     * @returns 
     */
    const getInitialDb = async (userUid: string) => {
        return getDoc(dbDocRef(userUid)).then(res => {
            console.log('user db', res)
            return res
        })
    }

    // update document

    /**
     * listens for changes that occurs in the database and runs the function passed in the argument
     * @param userUid 
     * @param setDbData - function that is run when there are changes in the database
     * @returns UnSubscribe function
     */
    const onDbChanges = (userUid: string, setDbData: any) => {
        return onSnapshot(dbDocRef(userUid), (snapshot) => {
            const docData = snapshot.data() as IUserDoc
            setDbData(docData)
            console.log('db change detected')
            console.log('new data: ', snapshot.data())
        })
    }

    return { createUserDb, getInitialDb, onDbChanges }
}