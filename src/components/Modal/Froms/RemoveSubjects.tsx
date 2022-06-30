import { useFirestore } from "@useFirebase";
import { ISubjects } from "Firebase/FirebaseDb";
import React from "react";
import { useController, useControllerData } from "../CustomModal";

const RemoveSubjects = () => {
    const setController = useController();
    const data = useControllerData();
    const { userData, dbFunctions } = useFirestore();

    const deleteSubjectsHandler = () => {
        if (!userData) return;
        setController(null);
        console.log("removing", data.subject.name);
        dbFunctions.setUserData(userData.userUid, {
            ...userData,
            subjects: userData.subjects.filter((subj) =>
                data.subject.some((removeSubj: ISubjects) => removeSubj.name !== subj.name)
            ),
        });
    };

    return (
        <div className="remove-subject-cont">
            <h1>Remove Subject Confirmation</h1>
            <p>
                Are you sure you want to remove the subjects{" "}
                {data.subject.map((subject: ISubjects) => `"${subject.name}"`)}?
            </p>
            <div className="modal-actions">
                <button className="cancel-delete" onClick={() => setController(null)}>
                    Cancel
                </button>
                <button className="confirm-delete" onClick={deleteSubjectsHandler}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default RemoveSubjects;
