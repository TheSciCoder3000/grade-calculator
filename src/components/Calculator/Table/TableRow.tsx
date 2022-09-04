// utility functions
import { useState, useEffect } from "react";

// types
import { ColumnFields, IUpdateRowProps } from "Firebase/FirebaseDb";
import { Cell, Row } from "react-table";

// env and styles
import { Edit, Save, Cancel } from "./svg";

interface ITableProps<T extends {}> {
    row: Row<T>;
    indx: number;
    prepareRow: (row: Row<T>) => void;
    addSubjectHandler: () => void;
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

    /**
     * state of the row component
     * ! the value of the state here does not dictate what the UI renders
     * * this is only used as a reference when uploading changes to the database
     */
    const [rowState, setRowState] = useState(parseRow(row));

    // refresh row state when rows props updates
    useEffect(() => resetRowFields(), [row]);

    /**
     * Calls the update function and passes the list of fields
     */
    const SaveChangesHandler = () => {
        // remove the name field from the state data and initialize field type as ColumnFields
        const otherFieldData = rowState
            .filter((field) => field.id !== "name")
            .map((field) => {
                return { ...field, type: field.type as ColumnFields };
            });

        // update subject
        updateSubjectHandler(
            row.original.id,
            { name: "name", value: rowState[0].value as string },
            otherFieldData
        );

        // disable edit mode
        // TODO: conditionally enable or disable edit mode if user input is invalid
        setEditMode(false);
    };

    /**
     * updates the row state each cell change
     * @param id - string id of the field
     * @param newValue - updated input value
     */
    const onCellChange = (id: string, newValue: string | number | undefined) => {
        setRowState((state) => {
            return state.map((field) => {
                if (field.id === id) return { ...field, value: newValue };
                return field;
            });
        });
    };

    /**
     * resets the row state when the cancel button is clicked.
     * - disables edit mode
     * - reverts the row state to its original value
     * * The edit cell values are automatically reseted since they are being unmounted when the edit mode is disabled
     */
    const resetRowFields = () => {
        setEditMode(false);
        setRowState(parseRow(row));
    };

    return (
        <tr {...row.getRowProps()}>
            {row.cells.map((cell) => {
                return (
                    <td {...cell.getCellProps()}>
                        {editMode && cell.column.id !== "selection" ? (
                            <EditCell cell={cell} onChange={onCellChange} />
                        ) : (
                            cell.render("Cell")
                        )}
                    </td>
                );
            })}
            <td className="row-controls">
                {!editMode ? (
                    <div className="main-controls">
                        <button onClick={addSubjectHandler} className="row-add-subject">
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
                        <button onClick={resetRowFields} className="cancel-edit">
                            <Cancel />
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
};

// =================================================== Edit Cell component ===================================================
interface IEditCell<T extends {}> {
    cell: Cell<T, string | number | undefined>;
    onChange: (id: string, newValue: string | number | undefined) => void;
}
const EditCell = <T extends {}>({ cell, onChange }: IEditCell<T>) => {
    /**
     * Helper function for parsing cell into cell state
     * @param rawCell
     * @returns
     */
    const parseCell = (rawCell: typeof cell) => {
        let cellInstance = rawCell.column as typeof cell.column & { type?: ColumnFields };
        return {
            id: cellInstance.id,
            name: cellInstance.Header as string,
            type: cellInstance.type || "name",
            value: cell.value,
        };
    };

    // component's state
    const [cellState, setCellState] = useState(parseCell(cell));

    /**
     * run onChange event on celState change
     * * changes in the edit cell state is passed down to the parent row state
     */
    useEffect(() => onChange(cellState.id, cellState.value), [cellState]);

    // on cell change update the cell state
    const updateCellState = (inputVal: string) =>
        setCellState((state) => {
            let cellValue: string | number | undefined;

            // if cell type is 'grades'
            if (state.type === "grades") {
                // parse cell value into int
                cellValue = parseInt(inputVal);

                // if cell value is less than 0, change into 0
                if (cellValue < 0) cellValue = 0;
                if (`${cellValue}` === "NaN") cellValue = undefined;
            } else {
                if (inputVal.trimStart().trimEnd()) cellValue = inputVal;
            }

            return {
                ...state,
                value: cellValue,
            };
        });

    return (
        <input
            type={cellState.type === "grades" ? "number" : "text"}
            value={cellState.type === "grades" ? `${cellState.value}` : cellState.value || ""}
            onChange={(e) => updateCellState(e.target.value)}
        />
    );
};

// =================================================== Helper Functions ===================================================
const parseRow = <T extends { id: string }>(row: Row<T>) =>
    row.cells
        .filter((cell) => cell.column.id !== "selection")
        .map((cell) => {
            const column = cell.column as typeof cell.column & { type?: ColumnFields };
            return {
                id: column.id as string,
                name: column.Header as string,
                type: column.type || "name",
                value: cell.value as string | number | undefined,
            };
        });

export default TableRow;
