import React, { useState, useMemo } from "react";
import { useFirestore } from "@useFirebase";
import { ISubjects } from "Firebase/FirebaseDb";
import { createSubjectsColumns, useTogglerCRUD } from "./utils";
import { useController } from "@Components/Modal";
import GradeTable from "@Components/Calculator/Table";
import Toggler from "../Toggler";
import "./Overview.css";

const CaluclatorOverview: React.FC = () => {
    // use firestore data and functions
    const { userData, dbFunctions } = useFirestore();

    // initialize component states
    const [yearId, setYearId] = useState("");
    const [semId, setSemId] = useState("");

    // ================================== State Updates ==================================
    /**
     * filtered subject data by year and sem
     */
    const data = useMemo(() => {
        const subjectData = userData?.subjects || ([] as ISubjects[]);
        return subjectData.filter((subj) => subj.year === yearId && subj.sem === semId);
    }, [yearId, semId, userData]);

    /**
     * Table columns generated using subject data
     */
    const TableColumns = useMemo(() => createSubjectsColumns(data), [data]);

    // ================================== Toggler CRUD Functions ==================================
    const { addItemHandler, removeItemHandler, updateItemHandler } = useTogglerCRUD(
        userData,
        dbFunctions.setUserData,
        (userStateData) => setYearId(userStateData.years[0].id),
        (userStateData) => setSemId(userStateData.sems[0].id)
    );

    // ================================== Table CRUD Functions ==================================
    /**
     * Used for toggling the modal
     */
    const setController = useController();

    /**
     * Adds a new subject item
     * @param indx - optional, indicates the position of the new subject in the list of subject
     */
    const addSubjectHandler = (indx?: number) => {
        setController({ target: "add-subject", data: { yearId, semId, indx } });
    };

    /**
     * Deletes the subject items
     * @param subject - a list of subjects that are to be deleted
     */
    const deleteSubjectHandler = (subject: ISubjects[]) => {
        setController({ target: "delete-subject", data: { subject } });
    };

    /**
     * Update changes made within a subject item
     * @param newRowData - an object containing the field name and value of the updated item in a subject
     */
    const SaveChangesHanlder = (newRowData: { name: string; value: string | undefined }[]) => {};

    return (
        <div className="calculator__overview-container">
            {userData ? (
                <>
                    <h1>Course Overview</h1>
                    <div className="section-selection">
                        <Toggler
                            className="year-cont"
                            activeItem={yearId}
                            items={userData.years}
                            addItemHandler={addItemHandler("years")}
                            removeItemHandler={removeItemHandler("years")}
                            updateItemHandler={updateItemHandler("years")}
                            onItemClick={setYearId}
                        />

                        <Toggler
                            className="sem-cont"
                            activeItem={semId}
                            items={userData.sems}
                            addItemHandler={addItemHandler("sems")}
                            removeItemHandler={removeItemHandler("sems")}
                            updateItemHandler={updateItemHandler("sems")}
                            onItemClick={setSemId}
                        />
                    </div>
                    <GradeTable
                        DATA={data}
                        COLUMNS={TableColumns}
                        addSubjectHandler={addSubjectHandler}
                        deleteSubjectHandler={deleteSubjectHandler}
                        SaveChangesHandler={SaveChangesHanlder}
                    />
                </>
            ) : (
                <div className="loading-data">Loading User data</div>
            )}
        </div>
    );
};

export default CaluclatorOverview;
