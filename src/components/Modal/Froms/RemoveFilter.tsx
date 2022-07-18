import { FilterTypes } from "Firebase/FirebaseDb";
import { useState } from "react";
import { useAllowOutsideClick, useController, useControllerData } from "../CustomModal";

export interface IRemoveFilter {
    id: string;
    name: string;
    type: FilterTypes;
    parentFilterId: string | undefined;
    APIRemoveFilter: {
        (filterType: "years", filterId: string): Promise<void>;
        (filterType: "sems", filterId: string, parentFilterId: string): Promise<void>;
    };
}

const RemoveFilter = () => {
    const { id, name, type, parentFilterId, APIRemoveFilter }: IRemoveFilter = useControllerData();
    const [deleting, setDeleting] = useState(false);
    const setController = useController();
    const setAllowOutsideClick = useAllowOutsideClick();

    const deleteFilterHandler = () => {
        setAllowOutsideClick(false);
        setDeleting(true);

        const reset = () => {
            setController(null);
            setAllowOutsideClick(true);
            setDeleting(false);
        };

        if (type === "years") APIRemoveFilter(type, id).then(reset);
        else {
            if (!parentFilterId) throw new Error("parent filter id is null or undefined");
            APIRemoveFilter(type, id, parentFilterId).then(reset);
        }
    };

    return (
        <div className="remove-subject-cont">
            <h1>Remove Subject Confirmation</h1>
            <p>Are you sure you want to remove the filter "{name}"?</p>
            <div className="modal-actions">
                <button disabled={deleting} className="cancel-delete" onClick={() => setController(null)}>
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
