import { useFirestore } from "@useFirebase";
import React from "react";
import { useController, useControllerData } from "../CustomModal";

const RemoveFilter = () => {
    const { id, name, type }: { id: string; name: string; type: "sems" | "years" } = useControllerData();
    const { userData, dbFunctions } = useFirestore();
    const setController = useController();

    const deleteFilterHandler = () => {
        if (!userData) return;

        dbFunctions.useFilterFunctions(userData).deleteFilter(type, id);
    };

    return (
        <div className="remove-subject-cont">
            <h1>Remove Subject Confirmation</h1>
            <p>Are you sure you want to remove the filter "{name}"?</p>
            <div className="modal-actions">
                <button className="cancel-delete" onClick={() => setController(null)}>
                    Cancel
                </button>
                <button className="confirm-delete" onClick={deleteFilterHandler}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default RemoveFilter;
