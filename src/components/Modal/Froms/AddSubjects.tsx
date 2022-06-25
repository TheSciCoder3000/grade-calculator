import { useFirestore } from "@useFirebase";
import { ICommonField } from "Firebase/FirebaseDb";
import { useEffect, useState } from "react";
import { useController } from "..";

const AddSubjects = () => {
    const [newSubjects, NewSubjects] = useState([]);
    const { userData } = useFirestore();
    const [terms, setTerms] = useState([] as ICommonField[]);
    const setController = useController();

    useEffect(() => {
        if (!userData) return;
        setTerms(userData.terms);
    }, [userData]);

    const AddSubjectsHandler = () => {
        setController(null); // closes the modal
    };
    return (
        <div className="add-subject-cont">
            <h1>Adding Subjects</h1>
            <p>You can add one or more subjects here and set their values</p>
            <div className="subject-input-cont">
                <div className="subject-fields">
                    <input className="name-field" type="text" placeholder="Subject Name" />
                    <div className="grades-cont">
                        <h2 className="grades-header">Grades</h2>
                        {terms.map((term) => (
                            <div className="grades-field">
                                {term.name}: <input type="number" placeholder={`${term.name} Grade`} />{" "}
                                <button className="add-term">+</button>
                            </div>
                        ))}
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
