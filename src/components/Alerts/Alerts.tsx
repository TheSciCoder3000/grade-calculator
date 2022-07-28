import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface AlertsProps {
    type: "info" | "warn" | "error";
    text: string;
    duration?: number;
}

/**
 * Alerts portal component
 * TODO: add animations
 */
const Alerts: React.FC<AlertsProps> = ({ text, type, duration = 1 }) => {
    const [show, setShow] = useState(true);
    useEffect(() => {
        setTimeout(() => setShow(false), duration * 1000);
    }, []);

    return ReactDOM.createPortal(
        show ? <div className={`alerts-cont alerts-${type}`}>{text}</div> : <></>,
        document.getElementById("app-alerts") as HTMLElement
    );
};

export default Alerts;
