import React, { useState, useMemo } from "react";
import { useFirestore } from "@useFirebase";
import { ISubjects, IUserDoc } from "Firebase/FirebaseDb";
import { createSubjectsColumns, useTogglerCRUD } from "./utils";
import { useController } from "@Components/Modal";
import GradeTable from "@Components/Calculator/Table";
import Toggler from "../Toggler";
import "./Overview.css";

// Component Props Interface
interface ICalculatorOverviewProps {
    /**
     * object containing the user's firestore data.
     * **This updates every time changes within the firestore occurs.**
     */
    userData: IUserDoc | null;
}

const CaluclatorOverview: React.FC<ICalculatorOverviewProps> = ({ userData }) => {
    const { dbFunctions } = useFirestore();
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
    const setController = useController();

    const addSubjectHandler = (indx?: number) => {
        setController({ target: "add-subject", data: { yearId, semId, indx } });
    };

    const deleteSubjectHandler = (subject: ISubjects[]) => {
        setController({ target: "delete-subject", data: { subject } });
    };

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
