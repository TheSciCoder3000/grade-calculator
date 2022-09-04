import { ISubjects, IUserDoc } from "Firebase/FirebaseDb";
import { useController, useControllerData } from "../CustomModal";

export interface IRemoveSubjects {
    subject: ISubjects[];
    APIRemoveSubjects: (subjects: ISubjects[], onFinished?: (() => void) | undefined) => Promise<IUserDoc>;
}
const RemoveSubjects = () => {
    const setController = useController();
    const { subject, APIRemoveSubjects }: IRemoveSubjects = useControllerData();

    /**
     * delete handler when the user confirms to delete the subject/s
     */
    const deleteSubjectsHandler = () => {
        APIRemoveSubjects(subject, () => setController(null));
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
