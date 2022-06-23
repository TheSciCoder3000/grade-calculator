import { IUserDoc } from "Firebase/FirebaseDb";
import { useState, useEffect } from "react";

// Intializing the Togglers component
type SetStateType = (userData: IUserDoc) => void;
type TInitializeTogglers = (userData: IUserDoc | null, ...setTogglers: SetStateType[]) => void;

export const useInitializeTogglers: TInitializeTogglers = (userData, ...setTogglers) => {
    const [initializeTable, setInitializeTable] = useState(false);
    useEffect(() => {
        // if userData is null or table has already been rendered
        if (!userData || initializeTable) return; // do not update togglers

        // else, for each toggler run the toggler functions
        setTogglers.forEach((setToggler) => setToggler(userData));
        setInitializeTable(true);
    }, [userData]);
};

// toggler crud functions
type HandlerType = "sems" | "years";
type TogglerCRUDType = (
    userData: IUserDoc | null,
    setUserData: (userId: string, newValue: IUserDoc) => Promise<void>
) => {
    addItemHandler: (field: HandlerType) => (fieldName: string) => void;
    removeItemHandler: (field: HandlerType) => (itemId: string) => void;
    updateItemHandler: (field: HandlerType) => (itemId: string, value: string) => void;
};

export const useTogglerCRUD: TogglerCRUDType = (userData, setUserData) => {
    const addItemHandler = (field: HandlerType) => (fieldName: string) => {
        if (!userData) return;

        let newUserData = { ...userData };
        newUserData[field].push({
            name: fieldName,
            id: Math.random().toString(16).substr(2, 12),
        });

        setUserData(userData?.userUid, newUserData).catch((e) => {
            console.log("something went wrong with addItemHandler");
            console.error(e);
        });
    };

    const removeItemHandler = (field: HandlerType) => (itemId: string) => {
        if (!userData) return;

        let newUserData = { ...userData };
        const itemIndx = newUserData[field].findIndex((item) => item.id === itemId);
        if (itemIndx !== -1) newUserData[field].splice(itemIndx, 1);
        setUserData(userData.userUid, newUserData).catch((e) => {
            console.log("error at remove item handler: ", e.message);
            console.error(e);
        });
    };

    const updateItemHandler = (field: HandlerType) => (itemId: string, value: string) => {
        if (!userData) return;

        let newUserData = { ...userData };
        let item = newUserData[field].find((itemInstance) => itemInstance.id === itemId);
        if (item) item.name = value;
        setUserData(userData.userUid, newUserData).catch((e) => {
            console.log("error at update item handler: ", e.message);
            console.error(e);
        });
    };

    return { addItemHandler, removeItemHandler, updateItemHandler };
};
