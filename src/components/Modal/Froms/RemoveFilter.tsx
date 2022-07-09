import { useFirestore } from "@useFirebase";
import { useState } from "react";
import { useAllowOutsideClick, useController, useControllerData } from "../CustomModal";

const RemoveFilter = () => {
    const {
        id,
        name,
        type,
        parentFilterId,
    }: { id: string; name: string; type: "sems" | "years"; parentFilterId: string } = useControllerData();
    const { userData, dbFunctions } = useFirestore();
    const [deleting, setDeleting] = useState(false);
    const setController = useController();
    const setAllowOutsideClick = useAllowOutsideClick();

    const deleteFilterHandler = () => {
        if (!userData) return;

        setAllowOutsideClick(false);
        setDeleting(true);

        const reset = () => {
            setController(null);
            setAllowOutsideClick(true);
            setDeleting(false);
        };

        const { deleteFilter } = dbFunctions.useFilterFunctions(userData);

        if (type === "years") deleteFilter(type, id).then(reset);
        else {
            if (!parentFilterId) throw new Error("parent filter id is null or undefined");
            deleteFilter(type, id, parentFilterId).then(reset);
        }
    };

    return (
        <div className="remove-subject-cont">
            <h1>Remove Subject Confirmation</h1>
            <p>Are you sure you want to remove the filter "{name}"?</p>
            <div className="modal-actions">
                <button className="cancel-delete" onClick={() => setController(null)}>
                    Cancel
                </button>
                <button disabled={deleting} className="confirm-delete" onClick={deleteFilterHandler}>
                    {deleting ? "deleting" : "Delete"}
                </button>
            </div>
        </div>
    );
};

export default RemoveFilter;
