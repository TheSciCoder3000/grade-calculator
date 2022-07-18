import { Trash } from "@Components/Calculator/Table/svg";
import { ISubjects, ColumnFields } from "Firebase/FirebaseDb";
import { useEffect, useRef, useState } from "react";
import { useController, useControllerData } from "../CustomModal";

type IFieldInputs = Record<ColumnFields, { id: string; name: string; value: string | number }[]>;
export interface IAddSubjectPayload {
    yearId: string;
    semId: string;
    indx: number | undefined;
    fields: { type: ColumnFields; fields: { id: string; name: string }[] }[];
    APIAddSubject: (subjectData: ISubjects, pos?: number | undefined) => Promise<void>;
}

/**
 * AddSubjects modal component
 * @returns add subjects JSX modal component
 */
const AddSubjects = () => {
    // modal data and manipulation
    const setController = useController();
    const modalPayload: IAddSubjectPayload = useControllerData();

    // input states
    const [fieldInputs, setfieldInputs] = useState<IFieldInputs>({ grades: [], extra: [] } as IFieldInputs);

    // parsed table fields
    const fields = modalPayload.fields.reduce((partial, curr) => {
        return [...partial, ...curr.fields.map((field) => field.name)];
    }, [] as string[]);

    // subject name field ref
    const subjectName = useRef<HTMLInputElement>(null);

    // initialize input fields
    useEffect(() => {
        if (modalPayload.fields)
            setfieldInputs((state) => {
                console.log({ fields: modalPayload.fields });
                return modalPayload.fields.reduce(
                    (partial, curr) => {
                        return {
                            ...partial,
                            [curr.type]: [
                                ...(partial[curr.type] || []),
                                ...curr.fields.map((fieldProp) => {
                                    return {
                                        id: fieldProp.id,
                                        name: fieldProp.name,
                                        value: curr.type === "grades" ? 0 : undefined,
                                    };
                                }),
                            ],
                        };
                        // return partial
                    },
                    { grades: [], extra: [] } as typeof state
                );
            });
    }, []);

    /**
     * create a new subject using user input
     * @returns
     */
    const AddSubjectsHandler = () => {
        // check if subject name is empty
        if (!subjectName.current?.value) return console.log("subject name is empty");

        // filter out null or undefined field names
        const fieldTypes: ColumnFields[] = ["grades", "extra"];
        let filteredSubjectData = fieldTypes.reduce(
            (partial, fieldName) => {
                return {
                    ...partial,
                    [fieldName]: partial[fieldName].filter((field) => {
                        // if field name is empty then exclude
                        if (!field.name) return false;

                        // if field value is empty and field name is not included in the set of fields
                        if (!field.value && !fields.includes(field.name) && field.value !== 0) return false;

                        // else include
                        return true;
                    }),
                };
            },
            { ...fieldInputs }
        );

        let NewSubjectData: ISubjects = {
            ...filteredSubjectData,
            name: subjectName.current.value,
            sem: modalPayload.semId,
            year: modalPayload.yearId,
            id: Math.random().toString(20).substring(2, 12),
        };

        console.log({ NewSubjectData });

        // send updates to the database
        modalPayload.APIAddSubject(NewSubjectData, modalPayload.indx);

        // close modal
        setController(null);
    };

    /**
     * adds an empty field input by updating the field input state of the component
     * for the user to enter a custom field name and value
     * @param type - "grade" or "extra"
     * @param newFieldInputPos - (optional) position where the field input will be placed relative to the
     */
    const addFieldInput = (type: ColumnFields, newFieldInputPos?: number) => {
        // if empty field input exists then cancel
        if (fieldInputs[type].some((field) => field.name === "")) return;

        // add new empty field input
        setfieldInputs((state) => {
            let newFields = [...state[type]];
            newFields.splice(newFieldInputPos || state[type].length, 0, {
                id: Math.random().toString(21).substring(2, 25),
                name: "",
                value: "",
            });
            return {
                ...state,
                [type]: newFields,
            };
        });
    };

    /**
     * updates the input field with new value on change event. It also handles form validation for number inputs
     * @param fieldType - "grade" or "extra"
     * @param fieldName - name of the field
     * @param newValue - new user input value
     */
    const onInputChange = (fieldType: ColumnFields, fieldName: string, newRawValue: string) => {
        let newValue: string | number | undefined = newRawValue;

        // if input type is grades
        if (fieldType === "grades") {
            // parse into integer
            newValue = parseInt(newValue as string);

            // convert to 0 is less than 0
            if (newValue < 0) newValue = 0;

            // if NaN, set to undefined
            if (`${newValue}` === "NaN") newValue = undefined;
        } else {
            if (newValue.trimEnd().trimStart() === "") newValue = undefined;
        }

        setfieldInputs((state) => {
            return {
                ...state,
                [fieldType]: state[fieldType].map((field) => {
                    if (field.name === fieldName) return { ...field, value: newValue };
                    else return field;
                }),
            };
        });
    };

    /**
     * handle changes in the input field for the subject name
     * @param fieldType
     * @param newFieldName
     * @param indx
     */
    const onFieldNameInputChange = (fieldType: ColumnFields, newFieldName: string, indx: number) => {
        setfieldInputs((state) => {
            return {
                ...state,
                [fieldType]: state[fieldType].map((field, fieldIndx) => {
                    if (fieldIndx === indx) return { ...field, name: newFieldName };
                    return field;
                }),
            };
        });
    };

    /**
     * Removes a newly added field input
     * @param fieldType
     * @param fieldIndx
     */
    const removeField = (fieldType: ColumnFields, fieldIndx: number) => {
        setfieldInputs((state) => {
            return {
                ...state,
                [fieldType]: state[fieldType].filter((_field, indx) => indx !== fieldIndx),
            };
        });
    };

    return (
        <div className="add-subject-cont">
            <h1>Adding Subjects</h1>
            <p>You can add one or more subjects here and set their values</p>

            {/* Modal Form */}
            <div className="subject-input-cont">
                <div className="subject-fields">
                    {/* Subject name form */}
                    <input ref={subjectName} className="name-field" type="text" placeholder="Subject Name" />

                    {/* Grades Form */}
                    <div className="field-group-cont grades-cont">
                        <h2 className="grades-header">
                            Grades
                            <button className="add-term" onClick={() => addFieldInput("grades")}>
                                +
                            </button>
                        </h2>
                        {fieldInputs.grades.map((term, indx) => (
                            <div key={indx} className="item-field">
                                {fields.includes(term.name) ? (
                                    term.name
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Field Name"
                                        onChange={(e) =>
                                            onFieldNameInputChange("grades", e.target.value, indx)
                                        }
                                    />
                                )}{" "}
                                :{" "}
                                <input
                                    type="number"
                                    value={`${term.value === undefined ? "" : term.value}`}
                                    placeholder={`${term.name} Grade`}
                                    onChange={(e) => onInputChange("grades", term.name, e.target.value)}
                                />{" "}
                                {!fields.includes(term.name) && (
                                    <button
                                        className="remove-field-btn"
                                        onClick={() => removeField("grades", indx)}
                                    >
                                        <Trash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Extra fields form */}
                    <div className="field-group-cont extra-cont">
                        <h2 className="extra-header">
                            Extra
                            <button className="add-term" onClick={() => addFieldInput("extra")}>
                                +
                            </button>
                        </h2>
                        {fieldInputs.extra.map((term, indx) => (
                            <div key={indx} className="item-field">
                                {fields.includes(term.name) ? (
                                    term.name
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Field Name"
                                        onChange={(e) =>
                                            onFieldNameInputChange("extra", e.target.value, indx)
                                        }
                                    />
                                )}{" "}
                                :{" "}
                                <input
                                    type="text"
                                    value={term.value === undefined ? "" : term.value}
                                    placeholder={`${term.name} value`}
                                    onChange={(e) => onInputChange("extra", term.name, e.target.value)}
                                />{" "}
                                {!fields.includes(term.name) && (
                                    <button
                                        className="remove-field-btn"
                                        onClick={() => removeField("extra", indx)}
                                    >
                                        <Trash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal Controls */}
            <div className="modal-actions">
                <button className="cancel-add" onClick={() => setController(null)}>
                    Cancel
                </button>
                <button className="add" onClick={AddSubjectsHandler}>
                    Add
                </button>
            </div>
        </div>
    );
};

interface IFIelFormsProps<T> {
    initialValue: { name: string; value: T }[];
    onChange: (fields: { name: string; value: T }[]) => void;
}
const FieldForms = <T extends number | string>({ initialValue, onChange }: IFIelFormsProps<T>) => {
    return <div className="grades-field-cont"></div>;
};

export default AddSubjects;
