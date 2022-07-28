import React, { useState, useEffect } from "react";
import { ColumnFields, IColumnProps } from "Firebase/FirebaseDb";
import { Column } from "react-table";
import { Add, DragHandle } from "../svg";

interface ITableColumnsProps<T extends {}> {
    columns: (Column<T> & { type?: ColumnFields })[];
    onTableColumnsChange: (ColumnsData: IColumnProps) => void;
}
interface IColumnFieldState {
    id: string;
    name: string | undefined;
    type: ColumnFields;
}

/**
 * Component that allows the users to re-arrange to add, modify, delete and re-arrange the columns of the tables
 * ! Table Column Settings Issues and fixes
 * TODO: Prevent component from removing undefined fields that have been originally initialized
 * TODO: Prevent user from creating a new column with a similar name
 * TODO: Warn user from deleting a column then creating a new column with a similar name
 * TODO: Provide the users information of the special difference between the `extra` and `grades` type columns
 */
const TableColumns = <T extends { id: string }>({ columns, onTableColumnsChange }: ITableColumnsProps<T>) => {
    const [columnFields, setColumnFields] = useState<IColumnFieldState[]>(parseColumns(columns));
    const [colSync, setColSync] = useState(true);

    useEffect(() => setColumnFields(parseColumns(columns)), [columns]);

    useEffect(() => setColSync(checkEquality(columnFields, parseColumns(columns))), [columnFields]);

    /**
     * Handles parsing of column field state to be sent to the api for update request
     * TODO: handle form validation to prevent updating empty fields
     */
    const SaveChangesHandler = () => {
        // parse component state into IColumnProps type
        const ParsedColumnState = columnFields.reduce(
            (partial, curr) => {
                const { type, ...columnProps } = curr;
                return {
                    ...partial,
                    [type]: [...partial[type], columnProps],
                };
            },
            { grades: [], extra: [] } as IColumnProps
        );

        // execute tableColumnsChange event
        onTableColumnsChange(ParsedColumnState);
    };

    /**
     * handles every changes within the column field inputs
     * TODO: make it capable of handling index changes
     * @param id - id of the field that's changed
     * @param newName - new name of the id that's changed
     * @param newPos - (optional) new position indx of the field item
     */
    const columnFieldChangeHandler = (id: string, newName: string, newPos?: number) => {
        setColumnFields((state) =>
            state.map((col) => {
                if (col.id === id) return { ...col, name: newName === "" ? undefined : newName };
                return col;
            })
        );
    };

    /**
     * handles when user clicks the add field button
     * @param colType
     * @param pos
     */
    const AddEventHandler = (colType: ColumnFields, prevItemId: string) => {
        const newField = {
            id: Math.random().toString(12).substring(2, 25),
            name: undefined,
            type: colType,
        };
        setColumnFields((state) => {
            return state.reduce((partial, curr) => {
                if (curr.name === undefined) return partial;
                if (curr.id === prevItemId) return [...partial, curr, newField];
                return [...partial, curr];
            }, [] as typeof state);
        });
    };

    return (
        <div className="table-columns-settings">
            {["extra", "grades"].map((colType) => (
                <div className="col-type-cont">
                    <h4>{colType === "extra" ? "Extra" : "Grades"}</h4>
                    {columnFields
                        .filter((field) => field.type === colType)
                        .map((col) => (
                            <ColumnFieldSettingItem
                                key={col.id}
                                id={col.id}
                                name={col.name || ""}
                                type={col.type}
                                onChange={columnFieldChangeHandler}
                                onAddBtnClick={() => AddEventHandler(colType as ColumnFields, col.id)}
                                included={
                                    parseColumns(columns).find((item) => item.id === col.id) ? true : false
                                }
                            />
                        ))}
                </div>
            ))}
            {!colSync && (
                <div className="table-col-setting-actions">
                    <button className="settings-btn save-settings" onClick={SaveChangesHandler}>
                        Save
                    </button>
                    <button
                        className="settings-btn cancel-settings"
                        onClick={() => setColumnFields(parseColumns(columns))}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

// ================================= Extra Components =================================
interface ColumnFieldSettingItemProps {
    id: string;
    name: string;
    type: ColumnFields;
    onChange: (id: string, newName: string, newPos?: number) => void;
    onAddBtnClick: () => void;
    included: boolean;
}
const ColumnFieldSettingItem: React.FC<ColumnFieldSettingItemProps> = ({
    id,
    name,
    type,
    onChange,
    onAddBtnClick,
    included,
}) => {
    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        onChange(id, inputValue);
    };

    return (
        <div className="col-field-item">
            {/* Item controls */}
            <div className="item-field-controls">
                <div className="btn-cont drag-icon-cont">
                    <DragHandle />
                </div>
                <div className="btn-cont add-item-field-cont" onClick={onAddBtnClick}>
                    <Add className="add-btn-svg" />
                </div>
            </div>

            {/* Item name edit input */}
            <input value={name} type="text" className="item-field-input" onChange={inputChangeHandler} />
            {included && <span className="included">*</span>}
        </div>
    );
};

// ================================= Component Helper Functions =================================
const parseColumns = <T extends { id: string }>(columns: (Column<T> & { type?: ColumnFields })[]) => {
    return columns
        .map((col) => {
            return {
                id: col.id as string,
                name: col.Header as string,
                type: col.type as ColumnFields,
            };
        })
        .filter((col) => col.id !== "name");
};

const checkEquality = (colState: IColumnFieldState[], colComponentProps: IColumnFieldState[]) => {
    let equality = true;
    colState.forEach((col, indx) => {
        const colProps = colComponentProps[indx];

        if (!colProps) equality = false;
        else if (colProps.id !== col.id || colProps.name !== col.name) equality = false;
    });

    return equality;
};

export default TableColumns;
