// components and hooks
import { useEffect, useRef, useState } from "react";
import TableColumns from "./Settings/TableColumns";

// types
import { Column } from "react-table";
import { IColumnProps, ColumnFields } from "Firebase/TypesInterface";

// assets and styles
import { Settings } from "./svg";
import "./Settings/TableSettings.css";

interface ITableSettingsProps<T extends { id: string }> {
    columns: Column<T>[];
    onTableColumnsChange: (ColumnsData: IColumnProps) => void;
    onTableColumnDelete: (ColumnType: ColumnFields, columnId: string) => void;
}

/**
 * Modal component that will be overlayed above when the settings button of the table is clicked
 * @param param0
 * @returns
 */
const TableSettings = <T extends { id: string }>({
    columns,
    onTableColumnsChange,
    onTableColumnDelete,
}: ITableSettingsProps<T>) => {
    // display state
    const [displayMenu, setDisplayMenu] = useState(false);
    const [enableOutsideClick, setEnableOutsideClick] = useState(false);

    // reference to the modal settings element for handling outside clicks
    const container = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (enableOutsideClick) return;

        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (
                container.current &&
                !container.current.contains(target) &&
                !target?.classList.contains("settings-btn") &&
                !target?.nodeName.includes("path") &&
                !target?.classList.contains("temp-btn-settings")
            ) {
                setDisplayMenu(false);
            }
        };
        document.addEventListener("click", handleOutsideClick);

        return () => document.removeEventListener("click", handleOutsideClick);
    }, [container]);

    return (
        <div ref={container} className="settings-cont">
            <button className="table-btns settings" onClick={() => setDisplayMenu((state) => !state)}>
                <Settings />
            </button>
            {displayMenu && (
                <div className="settings-menu">
                    <h3>Table Settings</h3>
                    <div className="table-settings-cont">
                        <TableColumns
                            columns={columns}
                            setEnableOutsideClick={setEnableOutsideClick}
                            onTableColumnsChange={onTableColumnsChange}
                            onTableColumnDelete={onTableColumnDelete}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableSettings;
