import React, { useState, useEffect, useRef } from "react";
import { Cancel } from "../Table/svg";

interface ITogglerProps {
    className?: string;
    items: { name: string; id: string }[];
    activeItem: string;
    addItemHandler: (fieldName: string) => any;
    removeItemHandler: (itemId: string) => any;
    updateItemHandler: (ItemId: string, value: string) => any;
    onItemClick: (itemId: string) => void;
}

/**
 * A list of togglers to filter the data being displayed in the table
 * @param {ITogglerProps} TogglerProps
 * @returns Togglers JSX Component
 */
const Toggler: React.FC<ITogglerProps> = ({
    className,
    activeItem,
    items,
    addItemHandler,
    removeItemHandler,
    updateItemHandler,
    onItemClick,
}) => {
    // ================================== Item Creation ==================================
    // Input Field creation states
    const [toggleFieldInput, setToggleFieldInput] = useState(false);
    const [fieldInputText, setFieldInputText] = useState("");
    const fieldInput = useRef<HTMLInputElement>(null);

    // Focus onto the input field upon rendering the input field for creating toggler items
    useEffect(() => {
        if (toggleFieldInput) fieldInput.current?.focus();
    }, [toggleFieldInput]);

    /**
     * Used to reset the add input fields
     */
    const resetInputField = () => {
        setToggleFieldInput(false);
        setFieldInputText("");
    };

    /**
     * An add item handler
     * @param e - Keyboard Event
     */
    const fieldInputHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (fieldInput.current) addItemHandler(fieldInput.current.value);
            resetInputField();
        } else if (e.key === "Escape") resetInputField();
    };

    // ================================== Item Rename ==================================
    /**
     * A list of inputfields and their element references
     */
    const editFields = useRef<Record<string, HTMLInputElement>>({});
    const [editMode, setEditMode] = useState<string | null>(null);

    /**
     * Toggle toggler item's edit mode
     * @param itemId - toggler item's id
     * @param itemName - default toggler item name
     */
    const dbClickHandler = (itemId: string, itemName: string) => {
        let editField = editFields.current[itemId];
        if (!editField) return;
        setEditMode(itemId);
        editField.value = itemName;
    };

    /**
     * Appends the element's ref value to the list of refs state
     * @param el - ref to the element
     * @param itemId - toggler item's id
     */
    const addEditFieldRefs = (el: HTMLInputElement | null, itemId: string) => {
        if (el && !Object.values(editFields.current).includes(el)) editFields.current[itemId] = el;
    };

    /**
     * Keyboard event handler for submiting changes in the toggler item
     * @param e - Keyboard Event
     * @param itemId - toggler item's id
     */
    const onEditKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>, itemId: string) => {
        if (e.key === "Enter") {
            setEditMode(null);
            updateItemHandler(itemId, editFields.current[itemId].value);
        } else if (e.key === "Escape") setEditMode(null);
    };

    // when on edit mode, focus on the input field
    useEffect(() => {
        if (editMode && editFields.current) editFields.current[editMode].focus();
    }, [editMode]);

    return (
        <div className={`toggler-cont ${className}`}>
            {items.map((item) => (
                <div
                    key={`${item.name}-${item.id}`}
                    onClick={() => onItemClick(item.id)}
                    onDoubleClick={() => dbClickHandler(item.id, item.name)}
                    className={`item-cont ${activeItem === item.id && "active-item"}`}
                >
                    {editMode === item.id ? "" : item.name}
                    <input
                        type="text"
                        ref={(el) => addEditFieldRefs(el, item.id)}
                        onBlur={() => setEditMode(null)}
                        style={{ display: editMode === item.id ? "block" : "none" }}
                        onKeyDown={(e) => onEditKeyHandler(e, item.id)}
                    />
                    <div className="delete-cont" onClick={() => removeItemHandler(item.id)}>
                        <Cancel />
                    </div>
                </div>
            ))}
            {toggleFieldInput && (
                <input
                    ref={fieldInput}
                    type="text"
                    className="field-input"
                    value={fieldInputText}
                    onChange={(e) => setFieldInputText(e.target.value)}
                    onBlur={() => resetInputField()}
                    onKeyDown={fieldInputHandler}
                />
            )}
            <button className="add-item-cont" onClick={() => setToggleFieldInput(true)}>
                +
            </button>
        </div>
    );
};

export default Toggler;
