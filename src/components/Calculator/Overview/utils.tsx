import { ISubjects, IUserDoc } from "Firebase/FirebaseDb";
import { useState, useEffect } from "react";
import { Cell, Column, Row } from "react-table";
import CourseCellLink from "../Table/CourseLink";

// toggler crud functions
type HandlerType = "sems" | "years";
type SetStateType = (userData: IUserDoc) => void;
type TogglerCRUDType = (
    userData: IUserDoc | null,
    setUserData: (userId: string, newValue: IUserDoc) => Promise<void>,
    ...setTogglers: SetStateType[]
) => {
    addItemHandler: (field: HandlerType) => (fieldName: string) => void;
    removeItemHandler: (field: HandlerType) => (itemId: string) => void;
    updateItemHandler: (field: HandlerType) => (itemId: string, value: string) => void;
};

/**
 * Initialize the togglers and generate toggler CRUD functions
 * @param userData - user's firestore data
 * @param setUserData - firebase function for updating the user's data
 * @param setTogglers - functions that are run when initializing the togglers
 * @returns toggler CRUD functions
 */
export const useTogglerCRUD: TogglerCRUDType = (userData, setUserData, ...setTogglers) => {
    const [initializeTable, setInitializeTable] = useState(false);
    useEffect(() => {
        // if userData is null or table has already been rendered
        if (!userData || initializeTable) return; // do not update togglers

        // else, for each toggler run the toggler functions
        setTogglers.forEach((setToggler) => setToggler(userData));
        setInitializeTable(true);
    }, [userData]);

    const addItemHandler = (field: HandlerType) => (fieldName: string) => {
        if (!userData) return;

        let newUserData = { ...userData };
        newUserData[field].push({
            name: fieldName,
            id: Math.random().toString(16).substr(2, 12),
        });

        setUserData(userData?.userUid, newUserData).catch((e) => {
            console.log("something went wrong with addItemHandler");
            console.error(e);
        });
    };

    const removeItemHandler = (field: HandlerType) => (itemId: string) => {
        if (!userData) return;

        let newUserData = { ...userData };
        const itemIndx = newUserData[field].findIndex((item) => item.id === itemId);
        if (itemIndx !== -1) newUserData[field].splice(itemIndx, 1);
        setUserData(userData.userUid, newUserData).catch((e) => {
            console.log("error at remove item handler: ", e.message);
            console.error(e);
        });
    };

    const updateItemHandler = (field: HandlerType) => (itemId: string, value: string) => {
        if (!userData) return;

        let newUserData = { ...userData };
        let item = newUserData[field].find((itemInstance) => itemInstance.id === itemId);
        if (item) item.name = value;
        setUserData(userData.userUid, newUserData).catch((e) => {
            console.log("error at update item handler: ", e.message);
            console.error(e);
        });
    };

    return { addItemHandler, removeItemHandler, updateItemHandler };
};

interface IColumn<T extends {}> {
    Header: string;
    accessor: string | ((doc: T) => number | string);
    Cell?: string | ((cell: Cell<T>) => JSX.Element | string);
    Footer?: string | ((row: { rows: Row<T>[] }) => JSX.Element | string);
}

/**
 * generate table columns data using subject array
 * @param subjects
 * @returns a column data type supported by the table component
 */
export const createSubjectsColumns = (subjects: ISubjects[]) => {
    let ExtraBlueprint = new Set<string>();
    let GradesBlueprint = new Set<string>();
    subjects.forEach((subject) => {
        subject.grades.forEach((grade) => {
            GradesBlueprint.add(grade.name);
        });
        subject.extra.forEach((extra) => {
            ExtraBlueprint.add(extra.name);
        });
    });

    return [
        {
            Header: "Course Name",
            accessor: "name",
            Cell: (cell) => {
                const value = cell.row.original;
                return <CourseCellLink courseName={value.name} courseId={value.id} />;
            },
            Footer: "Average",
        } as IColumn<ISubjects>,
        ...[...ExtraBlueprint].map((extra) => {
            return {
                Header: extra,
                accessor: (doc) => doc.extra.find((item) => item.name === extra)?.value,
                Cell: ({ row }) => row.values[extra] || "",
            } as IColumn<ISubjects>;
        }),
        ...[...GradesBlueprint].map((grade) => {
            return {
                Header: grade,
                accessor: (doc) => doc.grades.find((item) => item.name === grade)?.value,
                Cell: ({ row }) => row.values[grade],
                Footer: (prop) => {
                    const { rows } = prop;
                    const sum = rows.reduce((partialSum, row) => {
                        const rowVal = row.values[grade] as number;
                        return partialSum + rowVal;
                    }, 0);
                    return <>{(sum / rows.length).toFixed(2) || 0}</>;
                },
            } as IColumn<ISubjects>;
        }),
    ] as Column<ISubjects>[];
};
