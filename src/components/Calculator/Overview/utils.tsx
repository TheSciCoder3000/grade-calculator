import { useController } from "@Components/Modal";
import { IAddSubjectPayload } from "@Components/Modal/Froms/AddSubjects";
import { IRemoveFilter } from "@Components/Modal/Froms/RemoveFilter";
import { IRemoveSubjects } from "@Components/Modal/Froms/RemoveSubjects";
import { DBFunctionType, useFirestore } from "@useFirebase";
import {
    ColumnFields,
    FilterTypes,
    IColumnProps,
    ISubjects,
    IUpdateRowProps,
    IUserDoc,
    IYears,
    TableType,
} from "Firebase/FirebaseDb";
import { useState, useEffect } from "react";
import { Cell, Column, Row } from "react-table";
import CourseCellLink from "../Table/CourseLink";

/**
 * Handles Most of the Overview Component logic
 * * connects the overview component to the firebase api
 *
 */

// ! used for testing ui components by replacing db functions with fake functions
const useDbFunctions = (): DBFunctionType => {
    return {
        ...useFirestore().dbFunctions,
        // addFilter: async (filterType: any, filterData: any, parentFilterId?: any) =>
        //     console.log("fake add filter", { filterType, filterData, parentFilterId }),
        // deleteFilter: async (filterType: any, filterId: any, parentFilterId?: any) =>
        //     console.log("fake delete filter", { filterType, filterId, parentFilterId }),
        // updateFilters: async (filterType: any, newfilterData: any, parentFilterId?: any) =>
        //     console.log("fake update filter", { filterType, newfilterData, parentFilterId }),
        // addSubject: async (subjectData: any, pos?: any, newColumnData?: any) =>
        //     console.log("fake add subject", { subjectData, pos, newColumnData }),
        // deleteSubjects: async (AddSubjects: any, onFinished?: () => void) => {
        //     console.log("fake delete subjects", { AddSubjects });
        //     if (onFinished) onFinished();
        //     return {} as IUserDoc;
        // },
        // updateSubject: async (rowId: any, nameColData: any, otherColData: any) =>
        //     console.log("fake update subjects", { rowId, nameColData, otherColData }),
        // addTableColumn: async (TableType: any, ColumnType: any, ColumnName: any, pos?: any) =>
        //     console.log("fake add table column", { TableType, ColumnType, ColumnName, pos }),
        // removeTableColumn: async (TableType: any, ColumnType: any, ColumnId: any) =>
        //     console.log("fake add table column", { TableType, ColumnType, ColumnId }),
        // updateTableColumn: async (TableType: any, ColumnType: any, ColumnId: any, newName: any) =>
        //     console.log("fake add table column", { TableType, ColumnType, ColumnId, newName }),
        // setTableColumn: async (TableType: any, ColumnsData: any) =>
        //     console.log("fake set table columns", { TableType, ColumnsData }),
    };
};

// ============================================== toggler crud functions ==============================================
type SetStateType = (userStateYears: IYears[]) => void;

/**
 * Initialize the togglers and generate toggler CRUD functions
 * @param userId - user's firestore data
 * @param setTogglers - functions that are run when initializing the togglers
 * @returns toggler CRUD functions
 */
export const useTogglerCRUD = (userId: string, yearsData: IYears[], ...setTogglers: SetStateType[]) => {
    const setController = useController();
    const { addFilter, deleteFilter, updateFilters } = useDbFunctions();

    // on initial render
    const [initializeTable, setInitializeTable] = useState(false);
    useEffect(() => {
        // if userData is null or table has already been rendered
        if (!userId || initializeTable) return; // do not update togglers

        // else, for each toggler run the toggler functions
        setTogglers.forEach((setToggler) => setToggler(yearsData)); // set togglers to first item
        setInitializeTable(true);
    }, [userId]);

    // ================================================= Add filter item and overloads =================================================
    function addItemHandler(field: "years"): (fieldName: string) => void;
    function addItemHandler(field: "sems", parentFilterId: string): (fieldName: string) => void;

    /**
     * Adds a filter item
     * @param field
     * @param parentFilterId
     */
    function addItemHandler(field: FilterTypes, parentFilterId?: string): (fieldName: string) => void {
        if (!addFilter) throw new Error("unable to update when userData is null or undefined");

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
    function removeItemHandler(field: FilterTypes, parentFilterId?: string) {
        const APIRemoveFilter = deleteFilter;
        if (!APIRemoveFilter) return console.error("connot remove filter if userData is null");

        return (itemId: string) => {
            if (!userId) return;
            let itemRef: { name: string } | undefined;

            if (field === "years") {
                itemRef = yearsData.find((year) => year.id === itemId);
            } else {
                if (!parentFilterId) throw new Error("parent filter id is null or undefined");
                itemRef = yearsData
                    .find((year) => year.id === parentFilterId)
                    ?.sems.find((sem) => sem.id === itemId);
            }

            if (!itemRef) throw new Error(`item in ${field} with id ${itemId} does not exist`);
            const payload: IRemoveFilter = {
                id: itemId,
                name: itemRef.name,
                type: field,
                parentFilterId,
                APIRemoveFilter,
            };
            setController({
                target: "remove-filter",
                data: payload,
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
    function updateItemHandler(field: FilterTypes, parentFilterId?: string) {
        if (!updateFilters) throw new Error("unable to update when userData is null or undefined");

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

// ============================================== Table column functions ==============================================
interface OverviewColumns<T extends {}> {
    Header: string;
    accessor: string | ((doc: T) => number | string);
    Cell?: string | ((cell: Cell<T>) => JSX.Element | string);
    Footer?: string | ((row: { rows: Row<T>[] }) => JSX.Element | string);
}
interface ITableFields {
    grades: { id: string; name: string }[];
    extra: { id: string; name: string }[];
}
/**
 * generate table columns data using subject array
 * @param subjects
 * @returns a column data type supported by the table component
 */
export const createSubjectsColumns = (columnBlueprint: ITableFields) => {
    return [
        {
            id: "name",
            Header: "Course Name",
            accessor: "name",
            Cell: (cell) => {
                const value = cell.row.original;
                return <CourseCellLink courseName={value.name} courseId={value.id} />;
            },
            Footer: "Average",
        } as OverviewColumns<ISubjects>,
        ...[...columnBlueprint.extra].map((extra) => {
            return {
                id: extra.id,
                Header: extra.name,
                accessor: (doc) => doc.extra.find((item) => item.id === extra.id)?.value,
                Cell: ({ row }) => row.values[extra.id] || "",
                type: "extra",
            } as OverviewColumns<ISubjects>;
        }),
        ...[...columnBlueprint.grades].map((grade) => {
            return {
                id: grade.id,
                Header: grade.name,
                accessor: (doc) => doc.grades.find((item) => item.id === grade.id)?.value,
                Cell: ({ row }) => {
                    const rowVal = row.values[grade.id];
                    return rowVal === undefined ? "--" : rowVal;
                },
                Footer: (prop) => {
                    const { rows } = prop;
                    let undefinedItems = 0;
                    const sum = rows.reduce((partialSum, row) => {
                        const rowVal = row.values[grade.id] as number | undefined;

                        if (rowVal === undefined) {
                            undefinedItems += 1;
                            return partialSum;
                        }

                        return partialSum + rowVal;
                    }, 0);
                    return <>{(sum / (rows.length - undefinedItems) || 0).toFixed(2)}</>;
                },
                type: "grades",
            } as OverviewColumns<ISubjects>;
        }),
    ] as (Column<ISubjects> & { type: ColumnFields })[];
};

// ============================================== toggler crud functions ==============================================
/**
 * Function used to create an object containing methods for manipulating the data within the table
 * @param TableColumns - table columns created using the `createSubjectsColumns` function above
 * @param yearId - current year id state
 * @param semId - current sem id state
 * @returns - returns an object containing all the functions for manipulating table data
 */
export const useTableFunctions = (
    TableColumns: ReturnType<typeof createSubjectsColumns>,
    yearId: string,
    semId: string
) => {
    /**
     * Used for toggling the modal
     */
    const setController = useController();
    const { addSubject, deleteSubjects, updateSubject, addTableColumn, setTableColumn, removeTableColumn } =
        useDbFunctions();

    /**
     * Adds a new subject item
     * @param indx - optional, indicates the position of the new subject in the list of subject
     */
    const addSubjectHandler = (indx?: number) => {
        const APIAddSubject = addSubject;
        const APIAddTableColumns = addTableColumn;
        // check if add subject function exists
        if (!APIAddSubject || !APIAddTableColumns)
            return console.error("Cannot add subject when userData is null");

        // initialize the column fields of the table
        const fields = TableColumns.filter((col) => col.accessor !== "name").reduce((partial, curr) => {
            const newField = { id: curr.id as string, name: curr.Header as string };

            // if type already exists in array
            if (partial.some((field) => field.type === curr.type))
                // map through the array
                return partial.map((field) => {
                    // insert the new item if the types match
                    if (field.type === curr.type) return { ...field, fields: [...field.fields, newField] };
                    // else return default object
                    else return field;
                });

            // else append a new object with its type and the item as the first item in the array
            return [...partial, { type: curr.type, fields: [newField] }];
        }, [] as { type: ColumnFields; fields: { id: string; name: string }[] }[]);

        // display add subjects modal with attached payload
        const payload: IAddSubjectPayload = {
            yearId,
            semId,
            indx,
            fields,
            APIAddSubject,
            APIAddTableColumns,
        };

        // display add subject modal
        setController({ target: "add-subject", data: payload });
    };

    /**
     * Deletes the subject items
     * @param subject - a list of subjects that are to be deleted
     */
    const deleteSubjectHandler = (subject: ISubjects[]) => {
        const APIRemoveSubjects = deleteSubjects;
        if (!APIRemoveSubjects) return console.error("cannot delete subjects if userData is null");

        const payload: IRemoveSubjects = {
            subject,
            APIRemoveSubjects,
        };
        setController({ target: "delete-subject", data: payload });
    };

    /**
     * Update changes made within a subject item
     * @param otherColData - an object containing the field name and value of the updated item in a subject
     */
    const SaveChangesHandler = (
        rowId: string,
        nameColData: { name: "name"; value: string },
        otherColData: IUpdateRowProps[]
    ) => {
        if (!updateSubject) throw new Error("cannot update when userData is null or undefined");
        updateSubject(rowId, nameColData, otherColData);
    };

    /**
     * Sends updates from table columns to the api
     * @param ColumnsData
     */
    const TableColumnsChangeHandler = (ColumnsData: IColumnProps) => {
        if (!setTableColumn) throw new Error("unable to set table columns if userData is undefined or null");
        setTableColumn("overview", ColumnsData);
    };

    const DeleteTableColumnHandler = (ColumnType: ColumnFields, columnId: string) => {
        if (!removeTableColumn)
            throw new Error("unable to delete a table column item if userData is undefined or null");
        removeTableColumn("overview", ColumnType, columnId);
    };

    return {
        addSubjectHandler,
        deleteSubjectHandler,
        SaveChangesHandler,
        TableColumnsChangeHandler,
        DeleteTableColumnHandler,
    };
};


export type TableFunctionReturnType = ReturnType<typeof useTableFunctions>