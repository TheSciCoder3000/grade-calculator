import { useFirestore } from "@useFirebase";
import { ISubjects, IUserDoc } from "Firebase/FirebaseDb";
import React, { useState, useMemo } from "react";
import GradeTable from "../Table";
import Toggler from "../Toggler";
import { useInitializeTogglers, useTogglerCRUD } from "./utils";
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
    // initialize the togglers with the first item
    useInitializeTogglers(
        userData,
        (userStateData) => setYearId(userStateData.years[0].id),
        (userStateData) => setSemId(userStateData.sems[0].id)
    );

    // Subject data filtering update - used to filter the subject data by year and sem ids
    const data = useMemo(() => {
        const subjectData = userData?.subjects || ([] as ISubjects[]);
        return subjectData.filter((subj) => subj.year === yearId && subj.sem === semId);
    }, [yearId, semId, userData]);

    // ================================== Toggler CRUD Functions ==================================
    const { addItemHandler, removeItemHandler, updateItemHandler } = useTogglerCRUD(
        userData,
        dbFunctions.setUserData
    );

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
                    <GradeTable DATA={data} {...{ yearId, semId }} />
                </>
            ) : (
                <div className="loading-data">Loading User data</div>
            )}
        </div>
    );
};

export default CaluclatorOverview;