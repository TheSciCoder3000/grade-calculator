import React, { useState, useEffect, useRef } from "react";
import { ColumnFields, IColumnProps, TableType as ITableType } from "Firebase/TypesInterface";
import { Column } from "react-table";
import { Add, DragHandle } from "../svg";
import { useSetAlertItems } from "@Components/Alerts/Alerts";
import { Cancel } from "@Svg";

interface ITableColumnsProps<T extends {}> {
    columns: (Column<T> & { type?: ColumnFields })[];
    onTableColumnsChange: (ColumnsData: IColumnProps) => void;
    setEnableOutsideClick: React.Dispatch<React.SetStateAction<boolean>>;
    onTableColumnDelete: (ColumnType: ColumnFields, columnId: string) => void;
}
interface IColumnFieldState {
    id: string;
    name: string | undefined;
    type: ColumnFields;
}

/**
 * Component that allows the users to re-arrange to add, modify, delete and re-arrange the columns of the tables
 * TODO: Provide the users information of the special difference between the `extra` and `grades` type columns
 * TODO: Provide drag and arrange functionality
 */
const TableColumns = <T extends { id: string }>({
    columns,
    onTableColumnsChange,
    setEnableOutsideClick,
    onTableColumnDelete,
}: ITableColumnsProps<T>) => {
    const [columnFields, setColumnFields] = useState<IColumnFieldState[]>(parseColumns(columns));
    const [colSync, setColSync] = useState(true);
    const setAlertItems = useSetAlertItems();
    const [formValidity, setFormValidity] = useState(true);

    // resets the column fields when columns props are updated
    useEffect(() => setColumnFields(parseColumns(columns)), [columns]);

    // changes in the columnFields are checked and compared with columns props to check if data is synced
    useEffect(() => setColSync(checkEquality(columnFields, parseColumns(columns))), [columnFields]);

    /**
     * Handles parsing of column field state to be sent to the api for update request
     */
    const SaveChangesHandler = () => {
        if (!formValidity) return;

        // parse component state into IColumnProps type
        const ParsedColumnState = columnFields.reduce(
            (partial, curr) => {
                const { type, ...columnProps } = curr;

                if (columnProps.name === undefined) return partial;

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
     * handles when user clicks the add field button
     * @param colType
     * @param pos
     */
    const AddEventHandler = (colType: ColumnFields, prevItemId?: string) => {
        if (!formValidity) return;

        const newField = {
            id: Math.random().toString(12).substring(2, 25),
            name: undefined,
            type: colType,
        };

        setColumnFields((state) => {
            const firstItemIndx = state.findIndex((item) => item.type === "grades");

            // conditionally insert the newField into the array
            return state.reduce(
                (partial, curr, indx) => {
                    // remove previous undefined field items by excluding it from the array
                    if (curr.name === undefined) return partial;

                    // if the item id matches the prevId then insert the newField after it
                    if (curr.id === prevItemId) return [...partial, curr, newField];
                    // else if the prevItem is undefined and colType is set to 'Grades' then add the newField onto the given index
                    else if (prevItemId === undefined && colType === "grades") {
                        if (firstItemIndx === -1 && indx === state.length - 1)
                            return [...partial, newField, curr];
                        else if (indx === firstItemIndx) return [...partial, newField, curr];
                    }

                    // otherwise, just add the current field item by default
                    return [...partial, curr];
                },
                // set the starter array with newField if colType is 'extra' and prevItem is undefined
                (colType === "extra" && prevItemId === undefined ? [newField] : []) as typeof state
            );
        });
    };

    /**
     * handles every changes within the column field inputs
     * TODO: make it capable of handling index changes
     * @param id - id of the field that's changed
     * @param newName - new name of the id that's changed
     * @param newPos - (optional) new position indx of the field item
     */
    const columnFieldChangeHandler = (id: string, newName: string, included: boolean, newPos?: number) => {
        const newColFields = columnFields.map((col) => {
            if (col.id === id) return { ...col, name: newName === "" ? undefined : newName };
            return col;
        });

        // update column field state
        setColumnFields(newColFields);

        // check the validity of the column fields and the item name
        setFormValidity(testFormValidity(newColFields, newName, included));
    };

    /**
     * Run checks if recently inputed field name is similar with previous field names
     * @param newName
     */
    const BlurEventHandler = (itemName: string, included: boolean, setReFocus: () => void) => {
        // if newName is a duplicate
        if (!formValidity) {
            setReFocus();

            // if field name is invalid
            if (testNameValidity(itemName, included))
                setAlertItems((state) => [
                    ...state,
                    {
                        id: Math.random().toString(12).substring(2, 21),
                        text: `field name cannot be empty`,
                        type: "error",
                        duration: 5,
                    },
                ]);

            if (testDuplicates(columnFields))
                setAlertItems((state) => [
                    ...state,
                    {
                        id: Math.random().toString(12).substring(2, 21),
                        text: `field, "${itemName}", already exists`,
                        type: "error",
                        duration: 5,
                    },
                ]);
        }
    };

    const deleteFieldItemHandler = (columnType: ColumnFields, fieldId: string, included: boolean) => {
        if (included) onTableColumnDelete(columnType, fieldId);
        else
            setColumnFields((state) => {
                return state.filter((col) => col.id !== fieldId);
            });
    };

    return (
        <div className="table-columns-settings">
            {["extra", "grades"].map((colType) => (
                <div key={colType} className="col-type-cont">
                    <div className="field-header-cont">
                        <h4>{colType === "extra" ? "Extra" : "Grades"}</h4>
                        <button
                            className="settings-btn add-field-item"
                            onClick={() => AddEventHandler(colType as ColumnFields)}
                        >
                            <Add />
                        </button>
                    </div>
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
                                onDeleteBtnClick={() =>
                                    deleteFieldItemHandler(
                                        col.type,
                                        col.id,
                                        parseColumns(columns).find((item) => item.id === col.id)
                                            ? true
                                            : false
                                    )
                                }
                                included={
                                    parseColumns(columns).find((item) => item.id === col.id) ? true : false
                                }
                                onBlur={BlurEventHandler}
                            />
                        ))}
                </div>
            ))}
            {!colSync && (
                <div className="table-col-setting-actions">
                    <button
                        className="settings-btn save-settings"
                        onClick={SaveChangesHandler}
                        disabled={!formValidity}
                    >
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
    onChange: (id: string, newName: string, included: boolean, newPos?: number) => void;
    onBlur?: (itemName: string, included: boolean, setReFocus: () => void) => void;
    onAddBtnClick: () => void;
    onDeleteBtnClick: () => void;
    included: boolean;
}
const ColumnFieldSettingItem: React.FC<ColumnFieldSettingItemProps> = ({
    id,
    name,
    type,
    onChange,
    onBlur,
    onAddBtnClick,
    onDeleteBtnClick,
    included,
}) => {
    // input element ref
    const inputRef = useRef<HTMLInputElement>(null);

    const setAlertItems = useSetAlertItems();

    // ========================== Refocusing component logic ==========================
    const [reFocus, setReFocus] = useState(false);
    useEffect(() => {
        if (reFocus) {
            setReFocus(false);
            inputRef.current?.focus();
        }
    }, [reFocus]);

    // ========================== Component event handlers ==========================
    /**
     * sends an external onChange event outside the component
     */
    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        onChange(id, inputValue, included);
    };

    /**
     * Internal component event handler for handling blur events on invalid `included` fields
     */
    const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        // execute external onBlur event
        onBlur?.(e.target.value, included, () => setReFocus(true));
    };

    return (
        <div className="col-field-item">
            {/* Item controls */}
            <div className="item-field-controls">
                <div className="btn-cont drag-icon-cont">
                    <DragHandle />
                </div>
                <div className="btn-cont add-item-field-cont temp-btn-settings" onClick={onAddBtnClick}>
                    <Add className="btn-svg temp-btn-settings" />
                </div>
            </div>

            {/* Item name edit input */}
            <input
                ref={inputRef}
                onBlur={blurHandler}
                value={name}
                type="text"
                className="item-field-input"
                onChange={inputChangeHandler}
            />
            {included && (
                <span style={{ color: "red" }} className="included">
                    *
                </span>
            )}
            <button className="delete-field-item temp-btn-settings" onClick={onDeleteBtnClick}>
                <Cancel className="btn-svg temp-btn-settings" />
            </button>
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

const testFormValidity = (columnFields: IColumnFieldState[], itemName: string, included: boolean) => {
    let validity = true;
    // if newName is a duplicate
    if (testDuplicates(columnFields) || testNameValidity(itemName, included)) validity = false;

    return validity;
};

/**
 * function that test if there is a duplicate field name
 * @param columnFields
 * @returns - return true if duplicates are found and false if there are none
 */
const testDuplicates = (columnFields: IColumnFieldState[]) => {
    return columnFields
        .map((item) => item.name)
        .filter((item) => item !== undefined)
        .reduce((hasDuplicate, curr, _indx, fieldNames) => {
            if (fieldNames.indexOf(curr) !== fieldNames.lastIndexOf(curr)) {
                return true;
            }
            return hasDuplicate;
        }, false);
};

/**
 * function that tests if the field name is valid or not
 * @param itemName
 * @param included
 * @returns - return true if field name is invalid and false if it is valid
 */
const testNameValidity = (itemName: string, included: boolean) =>
    itemName.trimStart().trimEnd() === "" && included;

export default TableColumns;
