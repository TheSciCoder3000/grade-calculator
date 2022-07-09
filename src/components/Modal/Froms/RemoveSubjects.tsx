import { useFirestore } from "@useFirebase";
import { ISubjects } from "Firebase/FirebaseDb";
import { useController, useControllerData } from "../CustomModal";

const RemoveSubjects = () => {
    const setController = useController();
    const { subject }: { subject: ISubjects[] } = useControllerData();
    const { userData, dbFunctions } = useFirestore();

    /**
     * delete handler when the user confirms to delete the subject/s
     * TODO: extend so that it also deletes assessments under the subjects
     */
    const deleteSubjectsHandler = () => {
        if (!userData) return;

        dbFunctions.useSubjectFunctions(userData).deleteSubjects(subject, () => setController(null));
    };

    return (
        <div className="remove-subject-cont">
            <h1>Remove Subject Confirmation</h1>
            <p>
                Are you sure you want to remove the subjects {subject.map((subject) => `"${subject.name}"`)}{" "}
                and the assessments under them?
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
