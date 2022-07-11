import React, { useState, useMemo, useEffect } from "react";
import { useFirebaseAuth, useFirestore } from "@useFirebase";
import { ISubjects } from "Firebase/FirebaseDb";
import { createSubjectsColumns, useTogglerCRUD } from "./utils";
import { useController } from "@Components/Modal";
import GradeTable from "@Components/Calculator/Table";
import Toggler from "../Toggler";
import "./Overview.css";
import "dotenv/config";
import { Column } from "react-table";

const CaluclatorOverview: React.FC = () => {
    // use firestore data and functions
    const { userData, dbFunctions } = useFirestore();
    const { AuthStatus } = useFirebaseAuth();

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

    const fields = TableColumns.filter((col) => col.accessor !== "name").reduce((partial, curr) => {
        const newField = curr.Header as string;
        if (partial.some((field) => field.type === curr.type))
            return partial.map((field) => {
                if (field.type === curr.type) return { ...field, fields: [...field.fields, newField] };
                else return field;
            });

        return [...partial, { type: curr.type, fields: [newField] }];
    }, [] as { type: string; fields: string[] }[]);
    console.log({ fields });

    // ================================== Toggler CRUD Functions ==================================
    const { addItemHandler, removeItemHandler, updateItemHandler } = useTogglerCRUD(
        userData,
        (userStateData) => setYearId(userStateData.years[0].id),
        (userStateData) => setSemId(userStateData.years[0].sems[0].id)
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
        setController({ target: "add-subject", data: { yearId, semId, indx, fields } });
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
    const SaveChangesHandler = (rowId: string, newRowData: { name: string; value: string | undefined }[]) => {
        if (!userData) throw new Error("cannot update when userData is null or undefined");
        dbFunctions.getSubjectFunctions(userData).updateSubject(rowId, newRowData);
    };

    return (
        <div className="calculator__overview-container">
            {userData && (AuthStatus || process.env.REACT_APP_DEMO_MODE === "DEMO") ? (
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
                            onItemClick={(itemId) => {
                                setYearId(itemId);
                                setSemId(
                                    userData?.years.find((year) => year.id === itemId)?.sems[0].id || ""
                                );
                            }}
                        />

                        {yearId && (
                            <Toggler
                                className="sem-cont"
                                activeItem={semId}
                                items={userData.years.find((year) => year.id === yearId)?.sems || []}
                                addItemHandler={addItemHandler("sems", yearId)}
                                removeItemHandler={removeItemHandler("sems", yearId)}
                                updateItemHandler={updateItemHandler("sems", yearId)}
                                onItemClick={setSemId}
                            />
                        )}
                    </div>
                    <GradeTable
                        DATA={data}
                        COLUMNS={TableColumns}
                        addSubjectHandler={addSubjectHandler}
                        deleteSubjectHandler={deleteSubjectHandler}
                        SaveChangesHandler={SaveChangesHandler}
                    />
                </>
            ) : !AuthStatus ? (
                <div className="no-connection">No Connection</div>
            ) : (
                <div className="loading-data">Loading User data</div>
            )}
        </div>
    );
};

export default CaluclatorOverview;
