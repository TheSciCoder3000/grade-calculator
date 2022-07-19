// utility functions
import React, { useState, useMemo } from "react";
import { useFirebaseAuth, useFirestore } from "@useFirebase";
import { createSubjectsColumns, useTableFunctions, useTogglerCRUD } from "./utils";

// types
import { ISubjects } from "Firebase/FirebaseDb";

// Components
import GradeTable from "@Components/Calculator/Table";
import Toggler from "../Toggler";

// env and styles
import "./Overview.css";
import "dotenv/config";

// ! Fake data imports [remove when integrating database]
import { FakeSubjectData, FakeTableColumns, FakeYearData } from "./FakeOverviewData";

/**
 * Main Calculator component
 * @returns - a JSX calculator overview component
 */
const CaluclatorOverview: React.FC = () => {
    // use firestore data and functions
    // const { userData } = useFirestore();

    // ================================== userData Isolation ==================================
    // TODO: make the following variables a prop of a module
    // const uid = useMemo(() => "testUser", []);
    // const userYears = useMemo(() => userData?.years, [userData]);
    // const subjects = useMemo(() => userData?.subjects, [userData]);
    const uid = useMemo(() => "fake userid", []);
    const userYears = useMemo(() => FakeYearData, []);
    const subjects = useMemo(() => FakeSubjectData, []);
    const tableFields = useMemo(() => FakeTableColumns.overview, []);

    // ========================================================================================

    const { AuthStatus } = useFirebaseAuth();

    // initialize component states
    const [yearId, setYearId] = useState("");
    const [semId, setSemId] = useState("");

    // ================================== State Updates ==================================
    /**
     * filtered subject data by year and sem
     */
    const data = useMemo(() => {
        const subjectData = subjects || ([] as ISubjects[]);
        return subjectData.filter((subj) => subj.year === yearId && subj.sem === semId);
    }, [yearId, semId, subjects]);

    /**
     * Table columns generated using subject data
     */
    const TableColumns = useMemo(() => createSubjectsColumns(tableFields), [data]);

    // ================================== Toggler CRUD Functions ==================================
    const { addItemHandler, removeItemHandler, updateItemHandler } = useTogglerCRUD(
        uid || null,
        FakeYearData || [],
        (userStateYears) => setYearId(userStateYears[0].id),
        (userStateYears) => setSemId(userStateYears[0].sems[0].id)
    );

    // ================================== Table CRUD Functions ==================================
    const { addSubjectHandler, deleteSubjectHandler, SaveChangesHandler } = useTableFunctions(
        TableColumns,
        yearId,
        semId
    );

    return (
        <div className="calculator__overview-container">
            {uid && (AuthStatus || process.env.REACT_APP_DEMO_MODE === "DEMO") ? (
                <>
                    <h1>Course Overview</h1>
                    <div className="section-selection">
                        <Toggler
                            className="year-cont"
                            activeItem={yearId}
                            items={userYears || []}
                            addItemHandler={addItemHandler("years")}
                            removeItemHandler={removeItemHandler("years")}
                            updateItemHandler={updateItemHandler("years")}
                            onItemClick={(itemId) => {
                                setYearId(itemId);
                                setSemId(userYears?.find((year) => year.id === itemId)?.sems[0].id || "");
                            }}
                        />

                        {yearId && (
                            <Toggler
                                className="sem-cont"
                                activeItem={semId}
                                items={userYears?.find((year) => year.id === yearId)?.sems || []}
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
