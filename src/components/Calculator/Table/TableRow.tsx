import React, { useState, useRef, createRef, useEffect } from "react";
import { Row } from "react-table";
import { Edit, Save, Cancel } from "./svg";

interface ITableProps<T extends object = {}> {
    row: Row<T>;
    indx: number;
    prepareRow: (row: Row<T>) => void;
    addSubjectHandler: (indx?: number) => void;
    updateSubjectHandler: (rowId: string, newRowData: { name: string; value: string | undefined }[]) => void;
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

    // initialize refs for each column field
    const RowRefs = useRef(
        Object.keys(row.values).map((item) => {
            return { value: item, cellRef: createRef<HTMLInputElement>() };
        })
    );

    // focus on the first input element when in edit mode
    useEffect(() => {
        if (editMode) RowRefs.current[0].cellRef.current?.focus();
    }, [editMode]);

    /**
     * Calls the update function and passes the list of fields
     */
    const SaveChangesHandler = () => {
        // disable edit mode
        setEditMode(false);

        let newUserSubject = RowRefs.current.map((item) => {
            return {
                name: item.value,
                value: item.cellRef.current?.value,
            };
        });

        // update subject
        updateSubjectHandler(row.original.id, newUserSubject);
    };

    return (
        <tr {...row.getRowProps()}>
            {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>
                    {editMode && cell.column.id !== "selection" ? (
                        <EditCell
                            ref={RowRefs.current.find((refItem) => refItem.value === cell.column.id)?.cellRef}
                            value={cell.value}
                        />
                    ) : (
                        cell.render("Cell")
                    )}
                </td>
            ))}
            <div className="row-controls">
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
            </div>
        </tr>
    );
};

interface IEditCell {
    value: number | string;
}
const EditCell = React.forwardRef<HTMLInputElement, IEditCell>(({ value }, ref) => {
    const [inputValue, setInputValue] = useState(value);
    return (
        <input
            ref={ref}
            type={typeof value === "number" ? "number" : "text"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
        />
    );
});

export default TableRow;
