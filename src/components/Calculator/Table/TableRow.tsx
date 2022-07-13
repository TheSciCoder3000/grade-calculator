import React, { useState, useRef, createRef, useEffect } from "react";
import { Row } from "react-table";
import FormValidation from "@Utilities/FormValidation";
import { Edit, Save, Cancel } from "./svg";
import { ColumnFields, IUpdateRowProps } from "Firebase/FirebaseDb";

interface ITableProps<T extends object = {}> {
    row: Row<T>;
    indx: number;
    prepareRow: (row: Row<T>) => void;
    addSubjectHandler: (indx?: number) => void;
    updateSubjectHandler: (
        rowId: string,
        nameColData: { name: "name"; value: string },
        otherColData: IUpdateRowProps[]
    ) => void;
}

const TableRow = <T extends { id: string }>({
    row,
    indx,
    prepareRow,
    addSubjectHandler,
    updateSubjectHandler,
}: ITableProps<T>) => {
    prepareRow(row);
    const [editMode, setEditMode] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    // initialize refs for each column field
    const RowRefs = useRef(
        row.cells
            .map((cell) => {
                const column = cell.column as typeof cell.column & { type: ColumnFields };
                return {
                    id: column.id,
                    value: column.Header as string,
                    type: column.type,
                    cellRef: createRef<HTMLInputElement>(),
                };
            })
            .filter((field) => !["selection", "name"].includes(field.id))
    );

    // focus on the first input element when in edit mode
    useEffect(() => {
        if (editMode) RowRefs.current[0].cellRef.current?.focus();
    }, [editMode]);

    /**
     * Calls the update function and passes the list of fields
     */
    const SaveChangesHandler = () => {
        let updateSubject = true;
        // disable edit mode
        setEditMode(false);

        // check if subject name is valid
        const nameValue = nameRef.current?.value;
        if (!FormValidation().isStringInputValid(nameValue || ""))
            return console.error("cannot update subject with invalid name");

        // parse other column fields
        let newColFields = RowRefs.current
            // parses it into an array of { id, name, type, value }
            .reduce((partial, curr) => {
                const fieldValueRef = curr.cellRef.current;

                console.log("checking ", fieldValueRef);
                // if input field is not empty
                if (fieldValueRef && FormValidation().isStringInputValid(fieldValueRef)) {
                    console.log("valid field input ", curr.value);
                    return [
                        ...partial,
                        {
                            id: curr.id,
                            name: curr.value,
                            type: curr.type,
                            value:
                                curr.type === "grades" ? parseInt(fieldValueRef.value) : fieldValueRef.value,
                        },
                    ];
                }

                // return default
                return partial;
            }, [] as IUpdateRowProps[]);

        // update subject
        if (updateSubject)
            updateSubjectHandler(row.original.id, { name: "name", value: nameValue as string }, newColFields);
    };

    /**
     * function used to get the ref object for the edit cell
     * @param cellId - id of the column
     * @returns Ref Object or null
     */
    const getCellRef = (cellId: string) => {
        console.log("getting ref to ", cellId);
        const otherFieldRef = RowRefs.current.find((refItem) => refItem.id === cellId);
        if (!otherFieldRef) return cellId === "name" ? nameRef : null;
        return otherFieldRef.cellRef;
    };

    return (
        <tr {...row.getRowProps()}>
            {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>
                    {editMode && cell.column.id !== "selection" ? (
                        <EditCell ref={getCellRef(cell.column.id)} value={cell.value || ""} />
                    ) : (
                        cell.render("Cell")
                    )}
                </td>
            ))}
            <td className="row-controls">
                {!editMode ? (
                    <div className="main-controls">
                        <button onClick={() => addSubjectHandler(indx + 1)} className="row-add-subject">
                            +
                        </button>
                        <button onClick={() => setEditMode(true)} className="row-edit-subject">
                            <Edit />
                        </button>
                    </div>
                ) : (
                    <>
                        <button onClick={() => SaveChangesHandler()} className="row-save-subject">
                            <Save />
                        </button>
                        <button onClick={() => setEditMode(false)} className="cancel-edit">
                            <Cancel />
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
};

interface IEditCell {
    value: number | string;
}
const EditCell = React.forwardRef<HTMLInputElement, IEditCell>(({ value }, ref) => {
    const [inputValue, setInputValue] = useState(value);

    const setCellValue = (inputVal: string) => {
        setInputValue(() => {
            if (typeof value === "number") {
                const parsedValue = parseInt(inputVal);
                if (parsedValue >= 0) return parsedValue;
                return 0;
            }

            return inputVal;
        });
    };

    return (
        <input
            ref={ref}
            type={typeof value === "number" ? "number" : "text"}
            value={inputValue}
            onChange={(e) => setCellValue(e.target.value)}
        />
    );
});

export default TableRow;
