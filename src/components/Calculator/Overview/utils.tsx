import { useController } from "@Components/Modal";
import { useFirestore } from "@useFirebase";
import { ISubjects, IUserDoc } from "Firebase/FirebaseDb";
import { useState, useEffect } from "react";
import { Cell, Column, Row } from "react-table";
import CourseCellLink from "../Table/CourseLink";

// toggler crud functions
type HandlerType = "sems" | "years";
type SetStateType = (userData: IUserDoc) => void;

/**
 * Initialize the togglers and generate toggler CRUD functions
 * @param userData - user's firestore data
 * @param setTogglers - functions that are run when initializing the togglers
 * @returns toggler CRUD functions
 */
export const useTogglerCRUD = (userData: IUserDoc | null, ...setTogglers: SetStateType[]) => {
    const setController = useController();
    const { dbFunctions } = useFirestore();

    // on initial render
    const [initializeTable, setInitializeTable] = useState(false);
    useEffect(() => {
        // if userData is null or table has already been rendered
        if (!userData || initializeTable) return; // do not update togglers

        // else, for each toggler run the toggler functions
        setTogglers.forEach((setToggler) => setToggler(userData)); // set togglers to first item
        setInitializeTable(true);
    }, [userData]);

    // ================================================= Add filter item and overloads =================================================
    function addItemHandler(field: "years"): (fieldName: string) => void;
    function addItemHandler(field: "sems", parentFilterId: string): (fieldName: string) => void;

    /**
     * Adds a filter item
     * @param field
     * @param parentFilterId
     */
    function addItemHandler(field: HandlerType, parentFilterId?: string): (fieldName: string) => void {
        if (!userData) throw new Error("unable to update when userData is null or undefined");

        const { addFilter } = dbFunctions.useFilterFunctions(userData);
        if (field === "years") {
            return (fieldName: string) =>
                addFilter(field, {
                    id: Math.random().toString(16).substr(2, 12),
                    name: fieldName,
                    sems: [
                        {
                            id: Math.random().toString(16).substr(2, 12),
                            name: "1st sem",
                        },
                    ],
                }).catch((e) => {
                    console.log("something went wrong with addItemHandler");
                    console.error(e);
                });
        } else {
            if (!parentFilterId) throw new Error("Parent filter id is null or undefined");

            return (fieldName: string) =>
                addFilter(
                    field,
                    {
                        id: Math.random().toString(16).substr(2, 12),
                        name: fieldName,
                    },
                    parentFilterId
                );
        }
    }

    // ================================================= delete filter items and overloads =================================================
    function removeItemHandler(field: "years"): (itemId: string) => void;
    function removeItemHandler(field: "sems", parentFilterId: string): (itemId: string) => void;
    /**
     * Creates a remove item handler for removing filter items
     * @param field - "years" or "sems"
     */
    function removeItemHandler(field: HandlerType, parentFilterId?: string) {
        return (itemId: string) => {
            if (!userData) return;
            let itemRef: { name: string } | undefined;

            if (field === "years") {
                itemRef = userData.years.find((year) => year.id === itemId);
            } else {
                if (!parentFilterId) throw new Error("parent filter id is null or undefined");
                itemRef = userData.years
                    .find((year) => year.id === parentFilterId)
                    ?.sems.find((sem) => sem.id === itemId);
            }

            if (!itemRef) throw new Error(`item in ${field} with id ${itemId} does not exist`);
            setController({
                target: "remove-filter",
                data: {
                    id: itemId,
                    name: itemRef.name,
                    type: field,
                    parentFilterId,
                },
            });
        };
    }

    // ================================================= update filter items and overloads =================================================
    function updateItemHandler(field: "years"): (itemId: string, value: string) => void;
    function updateItemHandler(
        field: "sems",
        parentFilterId: string
    ): (itemId: string, value: string) => void;
    /**
     * Creates an update item handler to update a filter item using its itemId and new value as its paramter
     * @param field - "years" or "sems"
     */
    function updateItemHandler(field: HandlerType, parentFilterId?: string) {
        if (!userData) throw new Error("unable to update when userData is null or undefined");

        const { updateFilters } = dbFunctions.useFilterFunctions(userData);

        if (field === "years") {
            return (itemId: string, value: string) =>
                updateFilters(field, { id: itemId, name: value }).catch((e) => {
                    console.log("error at update item handler: ", e.message);
                    console.error(e);
                });
        } else {
            if (!parentFilterId) throw new Error("parent filter id is null or undefined");
            return (itemId: string, value: string) =>
                updateFilters(field, { id: itemId, name: value }, parentFilterId).catch((e) => {
                    console.log("error at update item handler: ", e.message);
                    console.error(e);
                });
        }
    }

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
                type: "extra",
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
                type: "grade",
            } as IColumn<ISubjects>;
        }),
    ] as (Column<ISubjects> & { type: string })[];
};
