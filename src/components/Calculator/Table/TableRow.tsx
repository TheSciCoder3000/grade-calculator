import { useFirestore } from "@useFirebase";
import { ISubjects } from "Firebase/FirebaseDb";
import React, { useState, useRef, createRef, useEffect } from "react";
import { Cell, Row } from "react-table";

interface ITableProps {
    row: Row<ISubjects>;
    indx: number;
    prepareRow: (row: Row<ISubjects>) => void;
    addSubjectHandler: (indx?: number) => void;
}

const TableRow: React.FC<ITableProps> = ({ row, indx, prepareRow, addSubjectHandler }) => {
    prepareRow(row);

    const { userData, dbFunctions } = useFirestore();
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
     * updates the database on the changes in each item
     */
    const SaveChangesHandler = () => {
        // cancel update if userData is null
        if (!userData) return;

        // disable edit mode
        setEditMode(false);

        // TODO: create a new object with the updated data
        let newUserSubject = [...userData.subjects].map((subj) => {
            if (subj.id === row.original.id) {
                return RowRefs.current.reduce(
                    (subjObj, currItem) => {
                        const inputEl = currItem.cellRef.current;
                        const itemField = currItem.value;

                        // if input element is null
                        if (!inputEl) return subjObj; // return the unchanged object

                        // initialize variables
                        let SubjCopy = { ...subjObj }; // create an editable copy of subject object

                        // either one of these var are defined or all of them are undefined
                        const gradeItem = SubjCopy.grades.find((gradeItem) => gradeItem.name === itemField); // create a ref to the grade item
                        const extraItem = SubjCopy.extra.find((extraItem) => extraItem.name === itemField); // create a ref to the extra item

                        // if the item value is "name"
                        if (currItem.value === "name")
                            SubjCopy[currItem.value] = inputEl.value; // update the name field
                        // else if subject.grades contains field
                        else if (gradeItem) gradeItem.value = parseInt(inputEl.value); // update new int value
                        // else if subject.extra contains field
                        else if (extraItem) extraItem.value = inputEl.value; // update new value
                        // else add to array of extra fields
                        else
                            SubjCopy.extra.push({
                                name: itemField,
                                value: inputEl.value,
                            });
                        return SubjCopy;
                    },
                    { ...row.original } as ISubjects
                );
            } else return subj;
        });

        dbFunctions.setUserData(userData.userUid, {
            ...userData,
            subjects: newUserSubject,
        });
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
                {!editMode && (
                    <div className="main-controls">
                        <button onClick={() => addSubjectHandler(indx + 1)} className="row-add-subject">
                            +
                        </button>
                        <button onClick={() => setEditMode(true)} className="row-edit-subject">
                            Edit
                        </button>
                    </div>
                )}
                {editMode && (
                    <>
                        <button onClick={() => SaveChangesHandler()} className="row-save-subject">
                            Save
                        </button>
                        <button onClick={() => setEditMode(false)} className="cancel-edit">
                            Cancel
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
