import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    DocumentSnapshot,
    DocumentData,
} from "firebase/firestore";
import { FirebaseApp } from "firebase/app";

/**
 * Firestore (Firebase Database) module
 * - functions to initialize the firestore when user is authenticated
 * - CRUD functions to add, update and delete data from the database
 */

/**
 * interface schema of the data received from the firestore
 */
export interface IUserDoc {
    userUid: string; // User's id
    // name: string                                                         // user's name
    years: ITableCommonProps[]; // collection of object containing the college year name and id
    subjects: ISubjects[]; // collection of object contianing the subject name and id
    sems: ITableCommonProps[]; // collection of object containing the sem name and id
    terms: ITableCommonProps[]; // collection of object containing the term name and id
}

/**
 * Global user field interface used to define the object's name and id
 * - `name`: string that will be displayed on the ui
 * - `id`: used for querying in the database
 */
export interface ITableCommonProps {
    /**
     * display name of item
     */
    name: string;
    /**
     * database item id
     */
    id: string;
}

interface IFieldProps {
    name: string;
    value: string | number;
}

/**
 * Subject interface that extends from the IUserField Interface.
 * Adds the following properties:
 * - `mid`: avg midterm grade
 * - `final`: avg finals grade
 */
export interface ISubjects extends ITableCommonProps {
    year: string;
    sem: string;
    grades: IFieldProps[];
    extra: IFieldProps[];
}

/**
 * interface
 * - `id:` item identifier
 * - `name:` Course Name
 * - `extra:` list of extra custom fields that is displayed in the table
 * - `subj`: subject id key
 * - `term`: term id key
 * - `type`: type name
 * - `grade`: assessment score
 */
export interface IAssessment extends ITableCommonProps {
    /**
     * subject id key (should be included inside the subject).
     * * **Item query identifier**
     */
    subj: string;
    /**
     * term id key (should be included inside the terms )
     * * **Used to filter which items will be displayed first**
     */
    term: string;
    /**
     * assessment category (ex. Enabling, Summative, Formative, Class Participation, etc.)
     * * **Used to determine which table the item will be placed**
     */
    catgory: string;
    grade: number;
    extra: IFieldProps[];
}

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
     * @param userUid
     * @returns
     */
    const createUserDb = async (userUid: string) => {
        const random = (length = 8) => Math.random().toString(16).substr(2, length);

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
                },
            ],
            subjects: [],
            sems: [
                {
                    name: "1st Semester",
                    id: semId,
                },
            ],
            terms: [
                {
                    name: "Grade",
                    id: termId,
                },
            ],
        };

        return setDoc(dbDocRef(userUid), docData);
    };

    /**
     * used to fetch the user's data
     * @param userId user's id
     * @returns a documnet snapshot
     */
    const fetchUserData = async (userId: string) => {
        return getDoc(doc(db, "users", userId));
    };

    /**
     * Creates an firestore event listener that listens to any changes within the document
     * @param userId string containing the user's id
     * @param dbHandler a function that is triggered when changes occur in the document
     * @returns Unsubscribe method to remove the listener
     */
    const dbListener = (userId: string, dbHandler: (doc: DocumentSnapshot<DocumentData>) => unknown) => {
        let unsub = onSnapshot(doc(db, "users", userId), dbHandler);
        return unsub;
    };

    /**
     * updates user data
     * @param userId user's database id
     * @param newUserData new value for user data
     * @returns a Promise that resolves once data is successfully sent to the backend
     */
    const setUserData = async (userId: string, newUserData: IUserDoc) => {
        return setDoc(doc(db, "users", userId), newUserData);
    };

    return { createUserDb, fetchUserData, dbListener, setUserData };
}
