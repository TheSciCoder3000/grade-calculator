// components and hooks
import { useEffect, useRef, useState } from "react";
import TableColumns from "./Settings/TableColumns";

// types
import { Column } from "react-table";
import { IColumnProps, ColumnFields } from "Firebase/TypesInterface";

// assets and styles
import { Settings } from "./svg";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [container]);

    return (
        <div ref={container} className="flex justify-center relative">
            <button className="table-btns settings" onClick={() => setDisplayMenu((state) => !state)}>
                <Settings className="h-6 w-6 fill-gray-400 hover:fill-gray-500 cursor-pointer" />
            </button>
            {displayMenu && (
                <div className="p-6 right-0 top-16 z-10 bg-white absolute border border-gray-300 shadow-md rounded-md">
                    <h3 className="mb-3">Table Settings</h3>
                    <div className="">
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
