import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    DocumentSnapshot,
    DocumentData,
    deleteDoc,
    query,
    where,
    collection,
    getDocs,
    writeBatch,
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
    years: IYears[]; // collection of object containing the college year name and id
    terms: ITableCommonProps[]; // collection of object containing the term name and id
    subjects: ISubjects[]; // collection of object contianing the subject name and id
}

export interface IYears extends ITableCommonProps {
    sems: ITableCommonProps[];
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

const random = (length = 8) => Math.random().toString(16).substr(2, length);

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

    // ========================================== Assessment CRUD functions ==========================================
    const getAssessmentFunctions = (userId: string) => {
        /**
         * adds an assessment to the subfolder of the user document
         * @param userId
         * @param assessmentData - data of the assessment item that will be added
         */
        const addAssessment = (assessmentData: IAssessment) => {
            return setDoc(doc(db, "users", userId, "assessments", assessmentData.id), assessmentData);
        };

        const assessmentListener = (
            userId: string,
            assessmentId: string,
            dbHandler: (doc: DocumentSnapshot<DocumentData>) => unknown
        ) => {
            return onSnapshot(doc(db, "users", userId, "assessments", assessmentId), dbHandler);
        };

        /**
         * updates the assessment item
         * @param userId
         * @param newAssessment
         */
        const updateAssessment = (newAssessment: IAssessment) => {
            return setDoc(doc(db, "users", userId, "assessments", newAssessment.id), newAssessment);
        };

        /**
         * delete an assessment item
         * @param itemIds - ids of all the assessment that will be deleted
         */
        const removeAssessment = (itemIds: string[]) => {
            if (itemIds.length > 498) throw new Error("Assessments to be deleted has exceeded 500");

            const q = query(
                collection(db, "users", userId, "assessments"),
                where("subj", "in", [...itemIds])
            );

            return getDocs(q).then((querySnapshot) => {
                const batch = writeBatch(db);
                querySnapshot.docs.forEach((snapshot) => {
                    console.log("ref", snapshot.ref);
                    batch.delete(snapshot.ref);
                });

                return batch.commit();
            });
        };

        return { addAssessment, assessmentListener, updateAssessment, removeAssessment };
    };

    // ========================================== Subjects CRUD functions ==========================================
    const getSubjectFunctions = (userData: IUserDoc) => {
        /**
         * adds a subject to the user data
         * @param subjectData
         */
        const addSubject = (subjectData: ISubjects, pos?: number) => {
            const subjectsCount = userData.subjects.length;

            let newSubjects = [...userData.subjects];
            newSubjects.splice(pos || subjectsCount, 0, subjectData);

            return setDoc(doc(db, "users", userData.userUid), {
                ...userData,
                subjects: [...newSubjects],
            });
        };

        /**
         * updates the subject item
         * @param newSubjectData
         */
        const updateSubject = (rowId: string, newRowData: { name: string; value: string | undefined }[]) => {
            const newSubjects = userData.subjects.map((subj) => {
                if (subj.id === rowId)
                    return newRowData.reduce(
                        (partial, curr) => {
                            if (curr.name === "name") return { ...partial, name: curr.value || "" };
                            else if (partial.grades.some((item) => item.name === curr.name))
                                return {
                                    ...partial,
                                    grades: partial.grades.map((gradeItem) => {
                                        if (gradeItem.name === curr.name)
                                            return { ...gradeItem, value: parseInt(curr.value || "0") };
                                        return gradeItem;
                                    }),
                                };
                            else if (partial.extra.some((item) => item.name === curr.name))
                                return {
                                    ...partial,
                                    extra: partial.extra.map((extraItem) => {
                                        if (extraItem.name === curr.name)
                                            return { ...extraItem, value: curr.value || "" };
                                        return extraItem;
                                    }),
                                };
                            return partial;
                        },
                        { ...subj }
                    );
                return subj;
            });

            return setDoc(doc(db, "users", userData.userUid), {
                ...userData,
                subjects: newSubjects,
            });
        };

        /**
         * delete subjects and the assessments
         * @param subjects
         * @param onFinished
         * @returns
         */
        const deleteSubjects = async (subjects: ISubjects[], onFinished?: () => void) => {
            if (subjects.length < 1) {
                onFinished && onFinished();
                return userData;
            }
            const subjectIds = new Set(subjects.map((subj) => subj.id));
            const q = query(
                collection(db, "users", userData.userUid, "assessments"),
                where("subj", "in", [...subjectIds])
            );

            return getAssessmentFunctions(userData.userUid)
                .removeAssessment([...subjectIds])
                .then(() => {
                    if (onFinished) onFinished();
                    const newUserData = {
                        ...userData,
                        subjects: [...userData.subjects.filter((subj) => ![...subjectIds].includes(subj.id))],
                    };
                    return setDoc(doc(db, "users", userData.userUid), newUserData).then(() => newUserData);
                });
        };

        return { addSubject, updateSubject, deleteSubjects };
    };

    // ========================================== Filters CRUD functions ==========================================
    /**
     * a set of filter CRUD functions
     * @param userData
     * @returns
     */
    const useFilterFunctions = (userData: IUserDoc) => {
        const userId = userData.userUid;

        type addFilterReturnType = ReturnType<typeof setDoc>;

        // ================================================= Add filter and overloads =================================================
        function addFilter(filterType: "years", filterData: IYears): addFilterReturnType;
        function addFilter(
            filterType: "sems",
            filterData: ITableCommonProps,
            parentFilterId: string
        ): addFilterReturnType;

        /**
         * add filters
         */
        function addFilter(
            filterType: "sems" | "years",
            filterData: IYears | ITableCommonProps,
            parentFilterId?: string
        ): addFilterReturnType {
            if (filterType === "years") {
                return setDoc(doc(db, "users", userId), {
                    ...userData,
                    years: [...userData.years, filterData as IYears],
                });
            }

            const yearIndx = userData.years.findIndex((year) => year.id === parentFilterId);
            if (yearIndx === -1) throw new Error(`parent filter id ${parentFilterId} does not exist`);

            const yearsCopy = [...userData.years];
            yearsCopy[yearIndx].sems.push(filterData as ITableCommonProps);
            return setDoc(doc(db, "users", userId), {
                ...userData,
                years: [...yearsCopy],
            } as IUserDoc);
        }

        // ================================================= Update filter and overloads =================================================
        interface IFilterData {
            id: string;
            name: string;
        }
        function updateFilters(filterType: "years", newFilterData: IFilterData): Promise<void>;
        function updateFilters(
            filterType: "sems",
            newFilterData: IFilterData,
            parentFilterId: string
        ): Promise<void>;

        /**
         * update a filter item
         * @param userId
         * @param userData - copy of user's document
         * @param filterType - either years or sems
         * @param newFilterData - new filter value
         */
        function updateFilters(
            filterType: "sems" | "years",
            newFilterData: IFilterData,
            parentFilterId?: string
        ): Promise<void> {
            let newUserData: IUserDoc = { ...userData };

            // if filter type is years
            if (filterType === "years") {
                // set new user data
                newUserData = {
                    ...userData,
                    years: [
                        ...userData.years.map((year) =>
                            year.id === newFilterData.id ? { ...year, name: newFilterData.name } : year
                        ),
                    ],
                };
            } else {
                // else, it is sems then check if parentFIlterId is null and throw error if it is
                if (!parentFilterId) throw new Error(`parent filter id is null or undefined`);

                // check if filter id exist then throw error if it doesnt
                const filterIndx = userData.years.findIndex((year) => year.id === parentFilterId);
                if (filterIndx === -1) throw new Error(`Filter item id ${newFilterData.id} does not exist`);

                // set new user data
                newUserData = {
                    ...userData,
                    years: [
                        ...userData.years.map((year) => {
                            // if year id is equal to parent fitler id
                            if (year.id === parentFilterId) {
                                // year with updated sems
                                return {
                                    ...year,
                                    sems: [
                                        ...year.sems.map((sem) =>
                                            sem.id === newFilterData.id
                                                ? { ...sem, name: newFilterData.name }
                                                : sem
                                        ),
                                    ],
                                };
                            }

                            // else return the original year object
                            return year;
                        }),
                    ],
                };
            }

            return setDoc(doc(db, "users", userId), newUserData);
        }

        // ================================================= delete filter and overloads =================================================
        function deleteFilter(filterType: "years", filterId: string): Promise<void>;
        function deleteFilter(filterType: "sems", filterId: string, parentFilterId: string): Promise<void>;

        function deleteFilter(filterType: "sems" | "years", filterId: string, parentFilterId?: string) {
            let newYearsData = [...userData.years];
            let deleteSubjects = [];

            // set the years and deleted subjects array depending on the filter type
            if (filterType === "years") {
                deleteSubjects = userData.subjects.filter((subj) => subj.year === filterId);
                newYearsData = userData.years.filter((year) => year.id !== filterId);
            } else {
                if (!parentFilterId) throw new Error("parent filter id is null or undefined");
                deleteSubjects = userData.subjects.filter(
                    (subj) => subj.year === parentFilterId && subj.sem === filterId
                );
                newYearsData = userData.years.map((year) => {
                    if (year.id === parentFilterId)
                        return {
                            ...year,
                            sems: year.sems.filter((sem) => sem.id !== filterId),
                        };

                    return year;
                });
            }

            // delete subjects first then delete filter
            return getSubjectFunctions(userData)
                .deleteSubjects(deleteSubjects)
                .then((newUserData) => {
                    return setDoc(doc(db, "users", userId), {
                        ...newUserData,
                        years: newYearsData,
                    });
                });
        }

        return { addFilter, updateFilters, deleteFilter };
    };

    return {
        createUserDb,
        fetchUserData,
        dbListener,
        useFilterFunctions,
        getSubjectFunctions,
        getAssessmentFunctions,
    };
}
