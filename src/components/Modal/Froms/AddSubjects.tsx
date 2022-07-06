import { useFirestore } from "@useFirebase";
import { ITableCommonProps, ISubjects } from "Firebase/FirebaseDb";
import { useEffect, useRef, useState } from "react";
import { useController, useControllerData } from "../CustomModal";

const AddSubjects = () => {
    // const [newSubjects, NewSubjects] = useState([]);
    const { userData, dbFunctions } = useFirestore();
    const [terms, setTerms] = useState([] as ITableCommonProps[]);
    const setController = useController();
    const modalPayload = useControllerData();

    useEffect(() => {
        if (!userData) return;
        setTerms(userData.terms);
    }, [userData]);

    // Submit Handler
    const subjectName = useRef<HTMLInputElement>(null);
    const gradeRef = useRef<HTMLInputElement>(null);
    const AddSubjectsHandler = () => {
        // check if elements are accessible
        if (!subjectName.current || !gradeRef.current || !userData) return;

        // if subject name exists then return error
        if (userData.subjects.some((subj) => subj.name === subjectName.current?.value))
            return alert("Subject name already exists");

        setController(null); // closes the modal

        // initialize new updates
        let userSubjects = [...userData.subjects];
        const newSubject: ISubjects = {
            sem: modalPayload.semId,
            year: modalPayload.yearId,
            extra: [],
            grades: [
                {
                    name: "Midterm",
                    value: parseInt(gradeRef.current.value),
                },
            ],
            name: subjectName.current.value,
            id: subjectName.current.value,
        };
        if (modalPayload.indx) userSubjects.splice(modalPayload.indx, 0, newSubject);
        else userSubjects.push(newSubject);

        // send updates to the database
        dbFunctions.setUserData(userData.userUid, {
            ...userData,
            subjects: userSubjects,
        });
    };
    return (
        <div className="add-subject-cont">
            <h1>Adding Subjects</h1>
            <p>You can add one or more subjects here and set their values</p>
            <div className="subject-input-cont">
                <div className="subject-fields">
                    <input ref={subjectName} className="name-field" type="text" placeholder="Subject Name" />
                    <div className="grades-cont">
                        <h2 className="grades-header">Grades</h2>
                        {terms.map((term) => (
                            <div className="grades-field">
                                {term.name}:{" "}
                                <input ref={gradeRef} type="number" placeholder={`${term.name} Grade`} />{" "}
                                <button className="add-term">+</button>
                            </div>
                        ))}
                    </div>
                    <div className="extra-cont">
                        <h2 className="extra-header">Extra</h2>
                    </div>
                </div>
            </div>
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

export default AddSubjects;
