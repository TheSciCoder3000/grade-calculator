import React, { createContext, useContext, useEffect, useState } from "react";
import { Cancel } from "@Svg";

// ================================= Context variables =================================
interface AlertsConextProps {
    alertItems: AlertItemProps[];
    setAlertItems: React.Dispatch<React.SetStateAction<AlertItemProps[]>>;
}
const AlertsContext = createContext<AlertsConextProps>({
    alertItems: [],
    setAlertItems: () => {},
} as AlertsConextProps);

export const useAlertItems = () => useContext(AlertsContext).alertItems;
export const useSetAlertItems = () => useContext(AlertsContext).setAlertItems;

// ================================= Components =================================
interface AlertItemProps {
    id: string;
    type: "info" | "warn" | "error";
    text: string;
    duration?: number;
}

/**
 * Alert context provider that wraps around the whole react main component
 * @returns JSX alert provide component
 */
export const AlertsProvider: React.FC = ({ children }) => {
    const [alertItems, setAlertItems] = useState<AlertItemProps[]>([]);

    return <AlertsContext.Provider value={{ alertItems, setAlertItems }}>{children}</AlertsContext.Provider>;
};

interface AlertsProps {}

/**
 * Alerts portal component imported into the main app component.
 * Renders the alerts on top of the app component.
 * TODO: add animations
 * TODO: limit alerts
 */
const Alerts: React.FC<AlertsProps> = () => {
    const { alertItems, setAlertItems } = useContext(AlertsContext);
    const [toBeDeleted, setToBeDeleted] = useState<string[]>([]);

    const onTimoutHandler = (itemId: string) => {
        setToBeDeleted((state) => [...state, itemId]);
    };

    useEffect(() => {
        if (toBeDeleted.length > 0) {
            const itemsCopy = [...toBeDeleted];
            const deletedId = itemsCopy.pop() as string;

            setToBeDeleted(itemsCopy);

            setAlertItems((state) => state.filter((item) => item.id !== deletedId));

            console.log({ deletedId });
        }
    }, [toBeDeleted]);

    return (
        <div className={`alerts-cont`}>
            {alertItems.map((item) => (
                <AlertItems key={item.id} onTimeoutFinished={() => onTimoutHandler(item.id)} {...item} />
            ))}
        </div>
    );
};

interface AlertItemsExtraProps {
    onTimeoutFinished: () => void;
}
/**
 * Alert items component. Displays the alerts initiated with their
 * corresponding message and alert styles
 */
const AlertItems: React.FC<AlertItemProps & AlertItemsExtraProps> = ({
    text,
    type,
    duration = 1,
    onTimeoutFinished,
}) => {
    const [deleteSent, setDeleteSent] = useState(false);

    useEffect(() => {
        if (!deleteSent) {
            const timeoutId = setTimeout(deleteHandler, duration * 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [deleteSent]);

    const deleteHandler = () => {
        onTimeoutFinished();
        setDeleteSent(true);
    };

    // TODO: add close btn to alert modal
    return (
        <div className={`alert-item alert-${type}`}>
            {text}
            <button className="cancel-btn" onClick={deleteHandler}>
                <Cancel />
            </button>
        </div>
    );
};

export default Alerts;
