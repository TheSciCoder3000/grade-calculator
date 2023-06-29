import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    DocumentSnapshot,
    DocumentData,
    query,
    where,
    collection,
    getDocs,
    writeBatch,
    Firestore
} from "firebase/firestore";

import { 
    IUserDoc, 
    IAssessment, 
    TableType,
    ISubjects,
    IColumnProps,
    ColumnFields,
    IUpdateRowProps,
    IYears,
    ItemCommonProps,
    FilterTypes,
 } from "Firebase/TypesInterface";

import FormValidation from "./FormValidation";

const getAssessmentFunctions = (userId: string, db: Firestore) => {
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
const getSubjectFunctions = (userData: IUserDoc, db: Firestore) => {
    /**
     * adds a subject to the user data
     * @param subjectData
     */
    interface AddColumnProps {
        TableType: TableType;
        ColumnData: IColumnProps;
    }
    const addSubject = async (subjectData: ISubjects, pos?: number, newTableColData?: AddColumnProps) => {
        const subjectsCount = userData.subjects.length;

        let newSubjects = [...userData.subjects];
        newSubjects.splice(pos || subjectsCount, 0, subjectData);

        // create a new userData
        let newUserData = {
            ...userData,
            subjects: [...newSubjects],
        };

        // if TableType is given then add new column data
        if (newTableColData) {
            const { TableType, ColumnData } = newTableColData;
            const TableRef = newUserData.columns[TableType];
            const ColumnTypes: ColumnFields[] = ["grades", "extra"];
            const getCurrColData = (colType: ColumnFields) => ColumnData[colType];

            // update new userData
            newUserData = {
                ...newUserData, // copy previous userData
                // insert new columns data
                columns: {
                    // copy previous columns data
                    ...newUserData.columns,
                    // insert new columns data for key `TableType` using base `TableRef`
                    [TableType]: ColumnTypes.reduce(
                        (partial, currColType) => {
                            // insert new column data in their corresponding column type key
                            return {
                                ...partial,
                                [currColType]: [...partial[currColType], ...getCurrColData(currColType)],
                            };
                        },
                        { ...TableRef }
                    ),
                },
            };
        }

        return setDoc(doc(db, "users", userData.userUid), newUserData);
    };

    /**
     * updates the subject item
     * @param newSubjectData
     */
    const updateSubject = (
        rowId: string,
        nameColData: { name: "name"; value: string },
        otherColData: IUpdateRowProps[]
    ) => {
        // map through the items subjects in userData
        const newSubjects = userData.subjects.map((subj) => {
            // grades and extra fields counter to track what indx new fields will be inserted
            let gradesCount = 0;
            let extraCount = 0;

            // if subject item id matches with the updated item
            if (subj.id === rowId)
                // then return a new updated subject object
                return otherColData.reduce(
                    // loop through every item in the updatedRowData
                    (partial, updatedRowData) => {
                        // destructure row data object
                        const { type, ...rowData } = updatedRowData;
                        let rowValue: string | number | undefined;

                        // if type is 'grades'
                        if (type === "grades") {
                            // increase grades count
                            gradesCount += 1;

                            // check if value is valid
                            if (FormValidation().isNumberInputValid(parseInt(`${rowData.value}`)))
                                rowValue = rowData.value as number;
                        } else {
                            // increase extra count
                            extraCount += 1;

                            // check if value is valid
                            if (FormValidation().isStringInputValid(rowData.value as string))
                                rowValue = rowData.value as string;
                        }

                        // if rowValue is undefined then remove field from data
                        if (rowValue === undefined) {
                            return {
                                ...partial,
                                [type]: partial[type].filter((item) => item.id !== rowData.id),
                            };
                        }

                        // get the item's index if it exists
                        const fieldIndx = partial[type].findIndex((field) => field.id === rowData.id);

                        // if field item does not exist then insert it in the same position from the array
                        if (fieldIndx < 0) {
                            let fieldDataCopy = [...partial[type]];
                            const insertFieldIndx = type === "grades" ? gradesCount - 1 : extraCount - 1;
                            fieldDataCopy.splice(insertFieldIndx, 0, { ...rowData, value: rowValue });
                            return { ...partial, [type]: fieldDataCopy };
                        }

                        return {
                            ...partial,
                            [type]: [
                                ...partial[type].slice(0, fieldIndx === 0 ? fieldIndx : fieldIndx),
                                { ...rowData, value: rowValue },
                                ...partial[type].slice(fieldIndx + 1),
                            ],
                        };
                    },
                    // initial object is a copy of the subject with the updated name
                    { ...subj, name: nameColData.value }
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

        return getAssessmentFunctions(userData.userUid, db)
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
const getFilterFunctions = (userData: IUserDoc, db: Firestore) => {
    const userId = userData.userUid;

    type addFilterReturnType = ReturnType<typeof setDoc>;

    // ================================================= Add filter and overloads =================================================
    function addFilter(filterType: "years", filterData: IYears): addFilterReturnType;
    function addFilter(
        filterType: "sems",
        filterData: ItemCommonProps,
        parentFilterId: string
    ): addFilterReturnType;

    /**
     * add filters
     */
    function addFilter(
        filterType: FilterTypes,
        filterData: IYears | ItemCommonProps,
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
        yearsCopy[yearIndx].sems.push(filterData as ItemCommonProps);
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
        filterType: FilterTypes,
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

    function deleteFilter(filterType: FilterTypes, filterId: string, parentFilterId?: string) {
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
        return getSubjectFunctions(userData, db)
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

// ========================================== Filters CRUD functions ==========================================
const getTableColumnFunctions = (userData: IUserDoc, db: Firestore) => {
    /**
     * adds a new column to a specific table(overview or details) and column group(grades or extra)
     * * validates if column id is unique
     * * optionally inserts the column data at a specified index (default: `last index`)
     * ! DEPRECATED
     * @param TableType - `overview` or `details`
     * @param ColumnType - `grades` or `extra`
     * @param ColumnName  - name of the column item that is to be created
     * @param pos = (optional) inserts the columnData at indx position
     */
    function addTableColumn(
        TableType: TableType,
        ColumnType: ColumnFields,
        ColumnName: string,
        pos?: number
    ) {
        const TableRef = userData.columns[TableType];
        let ColumnRef = [...TableRef[ColumnType]];
        const insertIndx = pos === undefined ? ColumnRef.length : pos;

        // create unique id for new column item
        const createId = () => Math.random().toString(21).substring(2, 21);
        const ColumnId = ColumnRef.reduce((id, col) => {
            if (id !== col.id) return id;
            let newId = createId();
            while (newId === col.id) newId = createId();
            return newId;
        }, createId());

        ColumnRef.splice(insertIndx, 0, { id: ColumnId, name: ColumnName });
        return setDoc(doc(db, "users", userData.userUid), {
            ...userData,
            columns: {
                ...userData.columns,
                [TableType]: {
                    ...TableRef,
                    [ColumnType]: ColumnRef,
                },
            },
        });
    }

    /**
     * removes a column from a specifiec table(overview or details) and column group(grades or extra)
     * * has no validation, the function will attempt to filter out the column item otherwise no changes will occur
     * TODO: if table type is 'overview' then delete the field values of the subjects
     * TODO: if table type is 'details' then delete the field values of the assessments
     * @param TableType - `overview` or `details`
     * @param ColumnType - `grades` or `extra`
     * @param columnId - column id that is to be removed
     */
    async function removeTableColumn(TableType: TableType, ColumnType: ColumnFields, columnId: string) {
        console.log(`deleting field "${columnId}" in type "${ColumnType}" at table "${TableType}"`);
        const TableRef = userData.columns[TableType];
        const ColumnRef = [...TableRef[ColumnType]].filter((field) => field.id !== columnId);

        // update columns data
        const newColumnsData = {
            ...userData.columns,
            [TableType]: {
                ...TableRef,
                [ColumnType]: ColumnRef,
            },
        };

        // create a new user data copy and add the updated columns data
        let newUserData = { ...userData, columns: newColumnsData };

        // update subject data if table type is 'overview'
        if (TableType === "overview") {
            newUserData = {
                ...newUserData,
                subjects: userData.subjects.map((subject) => {
                    return {
                        ...subject,
                        [ColumnType]: subject[ColumnType].filter((col) => col.id !== columnId),
                    };
                }),
            };
        } else {
            // else update the all the assessments
            await getDocs(collection(db, "users", userData.userUid, "assessments")).then((snapshot) => {
                const batch = writeBatch(db);

                // loop through each document in the collection
                snapshot.docs.forEach((doc) => {
                    const data = doc.data() as IAssessment;

                    // if assessment item does not have the column field then skip batch update
                    // this prevents unnecessary updates and reduces the write counts to the firebase
                    if (!data[ColumnType].some((col) => col.id === columnId)) return;

                    batch.update(doc.ref, {
                        ...data,
                        [ColumnType]: data[ColumnType].filter((col) => col.id !== columnId),
                    });
                });

                return batch.commit();
            });
        }

        console.log({ newUserData });
        return setDoc(doc(db, "users", userData.userUid), newUserData);
    }

    /**
     * updates the name of the column in the specific table(overview or details) and column group(grades or extra)
     * ! DEPRECATED
     * @param TableType - `overview` or `details`
     * @param ColumnType - `grades` or `extra`
     * @param columnId - column id that is to be updated
     * @param newName - new name of the column field
     */
    function updateTableColumn(
        TableType: TableType,
        ColumnType: ColumnFields,
        columnId: string,
        newName: string
    ) {
        const TableRef = userData.columns[TableType];
        const ColumnRef = [...TableRef[ColumnType]];

        return setDoc(doc(db, "users", userData.userUid), {
            ...userData,
            columns: {
                ...userData.columns,
                [TableType]: {
                    ...TableRef,
                    [ColumnType]: ColumnRef.map((field) => {
                        if (field.id === columnId) return { ...field, name: newName };
                        return field;
                    }),
                },
            },
        });
    }

    /**
     * global table column function for adding, deleting and updating
     * @param TableType
     * @param ColumnsData
     * @returns
     */
    function setTableColumn(TableType: TableType, ColumnsData: IColumnProps) {
        return setDoc(doc(db, "users", userData.userUid), {
            ...userData,
            columns: {
                ...userData.columns,
                [TableType]: ColumnsData,
            },
        });
    }

    return {
        addTableColumn,
        removeTableColumn,
        updateTableColumn,
        setTableColumn,
    };
};

export const getFirestoreFunctions = (db: Firestore) => (userData: IUserDoc) => {
    return {
        ...getAssessmentFunctions(userData.userUid, db),
        ...getSubjectFunctions(userData, db),
        ...getFilterFunctions(userData, db),
        ...getTableColumnFunctions(userData, db),
    };
};
