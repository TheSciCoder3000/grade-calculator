import { useFirestore } from "@useFirebase";
import { ISubjects, IUserDoc } from "Firebase/FirebaseDb";
import React, { useEffect, useState, useMemo } from "react";
import GradeTable from "../Table";
import Toggler from "../Toggler";
import { useInitializeTogglers, useTogglerCRUD } from "./utils";
import "./Overview.css";

// TODO: remove this once connected to firestore
const DATA: ISubjects[] = [
    {
        id: "cpe",
        name: "CPET121",
        year: "7cb0cb84962b",
        sem: "1c073661e7a9",
        grades: [
            {
                name: 'Midterm',
                value: 97,
            },
            {
                name: 'Finals',
                value: 100,
            }
        ],
    },
    {
        id: "engm",
        name: "ENGM121",
        year: "7cb0cb84962b",
        sem: "1c073661e7a9",
        grades: [
            {
                name: 'Midterm',
                value: 91,
            },
            {
                name: 'Finals',
                value: 92,
            }
        ],
    },
    {
        id: "math",
        name: "MATH121",
        year: "7cb0cb84962b",
        sem: "1c073661e7a9",
        grades: [
            {
                name: 'Midterm',
                value: 93,
            },
            {
                name: 'Finals',
                value: 95,
            }
        ],
    },
];

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
    const subjectData =  userData?.subjects || [] as ISubjects[];
    const data = useMemo(
        () => subjectData.filter((subj) => subj.year === yearId && subj.sem === semId),
        [yearId, semId]
    );

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
                    <GradeTable DATA={data} />
                </>
            ) : (
                <div className="loading-data">Loading User data</div>
            )}
        </div>
    );
};

export default CaluclatorOverview;
