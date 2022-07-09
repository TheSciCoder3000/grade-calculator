import { useEffect, useRef, useState } from "react";
import { Settings } from "./svg";

const TableSettings = () => {
    const [displayMenu, setDisplayMenu] = useState(false);

    const container = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (container.current && !container.current.contains(e.target as Node | null))
                setDisplayMenu(false);
        };
        document.addEventListener("click", handleOutsideClick);

        return () => document.removeEventListener("click", handleOutsideClick);
    }, [container]);

    return (
        <div ref={container} className="settings-cont">
            <button className="settings" onClick={() => setDisplayMenu((state) => !state)}>
                <Settings />
            </button>
            {displayMenu && (
                <div className="settings-menu">
                    <h3>Table Settings</h3>
                </div>
            )}
        </div>
    );
};

export default TableSettings;
