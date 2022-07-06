import { useMemo } from "react";
import { useTable, useSortBy, useRowSelect, Column } from "react-table";
import SortIcon from "./SortIcon";
import TableRow from "./TableRow";
import { selectionHook } from "./utils";
import { Trash, Settings } from "./svg";
import "./Table.css";

interface ITableProps<T extends {}> {
    DATA: T[];
    COLUMNS: Column<T>[];
    addSubjectHandler: (indx?: number) => void;
    deleteSubjectHandler: (selectedRows: T[]) => void;
    SaveChangesHandler: (newRowData: { name: string; value: string | undefined }[]) => void;
}

/**
 * Reusable table component
 * - data - data that will be displayed in the table
 * - CRUD - crud functions to manipulate the database
 * @param {ITableProps} TableProps
 * @returns Reusable Table JSX Component
 */
const GradeTable = <T extends { id: string }>({
    DATA,
    COLUMNS,
    addSubjectHandler,
    deleteSubjectHandler,
    SaveChangesHandler,
}: ITableProps<T>) => {
    // Initialize columns
    const columns = useMemo(() => COLUMNS, [COLUMNS]);

    // Intialize Data
    const data = useMemo(() => DATA, [DATA]);

    // Initialize table props from react table
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        footerGroups,
        selectedFlatRows,
    } = useTable({ columns, data }, useSortBy, useRowSelect, selectionHook);

    /**
     * map selected rows to the delete function handler
     */
    const onSubjectsDelete = () => deleteSubjectHandler(selectedFlatRows.map((row) => row.original));

    return (
        <div className="table-cont">
            {/* ============================== Table Controls ============================== */}
            <div className="table-controls">
                <button className="trash" disabled={selectedFlatRows.length === 0} onClick={onSubjectsDelete}>
                    <Trash />
                </button>
                <button className="settings">
                    <Settings />
                </button>
            </div>

            {/* ============================== Main table ============================== */}
            <table {...getTableProps({ className: "calculator__table" })}>
                {/* +++++++++++++++++++++ Table Header +++++++++++++++++++++ */}
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, indx) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    <div className="table-data-cont">
                                        {column.render("Header")}
                                        <span>
                                            {column.id !== "selection" && (
                                                <SortIcon
                                                    key={indx}
                                                    sort={
                                                        column.isSorted
                                                            ? column.isSortedDesc
                                                                ? "desc"
                                                                : "asc"
                                                            : ""
                                                    }
                                                />
                                            )}
                                        </span>
                                    </div>
                                </th>
                            ))}

                            {/* used to remove the whitespace */}
                            <th></th>
                        </tr>
                    ))}
                </thead>

                {/* +++++++++++++++++++++ Table Body +++++++++++++++++++++ */}
                <tbody {...getTableBodyProps()}>
                    {rows.length > 0 ? (
                        rows.map((row, indx) => (
                            <TableRow
                                row={row}
                                indx={indx}
                                prepareRow={prepareRow}
                                addSubjectHandler={addSubjectHandler}
                                updateSubjectHandler={SaveChangesHandler}
                            />
                        ))
                    ) : (
                        <tr>
                            <td className="no-subjects-row" colSpan={3} onClick={() => addSubjectHandler()}>
                                {/* TODO: modify to dynamically display the table item besides subjects */}+
                                Add Subject
                            </td>
                        </tr>
                    )}
                </tbody>

                {/* +++++++++++++++++++++ Table Footer +++++++++++++++++++++ */}
                <tfoot>
                    {footerGroups.map((footerGroup) => (
                        <tr {...footerGroup.getFooterGroupProps()}>
                            {footerGroup.headers.map((column) => (
                                <td {...column.getFooterProps()}>{column.render("Footer")}</td>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
        </div>
    );
};

export default GradeTable;
