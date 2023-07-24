import FormValidation from "@Utilities/FormValidation";
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

    // sets the first item active when an item is deleted
    const itemCount = useRef(items.length);
    useEffect(() => {
        if (itemCount.current !== items.length) {
            if (itemCount.current > items.length && items[0]) onItemClick(items[0].id);
            itemCount.current = items.length;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

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
        if (e.key === "Enter" && fieldInput.current) {
            const newTogglerValue = fieldInput.current.value;
            if (FormValidation().isStringInputValid(newTogglerValue)) {
                addItemHandler(fieldInput.current.value);
                resetInputField();
            }
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
        const newTogglerValue = editFields.current[itemId].value;
        if (e.key === "Enter" && FormValidation().isStringInputValid(newTogglerValue)) {
            setEditMode(null);
            updateItemHandler(itemId, newTogglerValue);
        } else if (e.key === "Escape") setEditMode(null);
    };

    // when on edit mode, focus on the input field
    useEffect(() => {
        if (editMode && editFields.current) editFields.current[editMode].focus();
    }, [editMode]);


    return (
        <div className={`flex space-x-4 text-sm`}>
            {items.map((item) => (
                <div
                    className={`px-5 py-[7px] flex shadow-sm items-center select-none space-x-3 border border-gray-300 rounded-full ${activeItem === item.id && " bg-green-600 text-white border-green-600"}`}
                    key={`${item.name}-${item.id}`}
                    onClick={() => activeItem !== item.id && onItemClick(item.id)}
                    onDoubleClick={() => dbClickHandler(item.id, item.name)}
                    style={items.length === 1 ? { paddingRight: "1.25rem" } : {}}
                >
                    {editMode !== item.id && (<span className="cursor-text">{item.name}</span>)}
                    <input
                        className={`bg-green-600 outline-none ${activeItem === item.id && "text-white"}`}
                        type="text"
                        ref={(el) => addEditFieldRefs(el, item.id)}
                        onBlur={() => setEditMode(null)}
                        style={{ display: editMode === item.id ? "block" : "none" }}
                        onKeyDown={(e) => onEditKeyHandler(e, item.id)}
                    />
                    {items.length > 1 && (
                        <div className={activeItem === item.id ? "fill-white" : "fill-gray-400"} onClick={() => removeItemHandler(item.id)}>
                            <Cancel className="cursor-pointer hover:fill-gray-500" />
                        </div>
                    )}
                </div>
            ))}
            {toggleFieldInput && (
                <input
                    className="w-[8rem] px-4 rounded-full border outline-none border-gray-300"
                    ref={fieldInput}
                    type="text"
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
