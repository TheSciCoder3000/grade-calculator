// utility functions
import { useMemo } from "react";
import { useTable, useSortBy, useRowSelect } from "react-table";
import { selectionHook } from "./utils";

// components
import TableRow from "./TableRow";
import TableSettings from "./TableSettings";

// types
import { ISubjects } from "Firebase/TypesInterface";
import { Column } from "react-table";

// env and styles
import { Trash } from "./svg";
import SortIcon from "./SortIcon";
import "./Table.css";
import { TableFunctionReturnType } from "../Overview/utils";

interface ITableProps<T extends {}> {
    DATA: T[];
    COLUMNS: Column<T>[];
    TableFunctions: TableFunctionReturnType
}

/**
 * Reusable table component
 * - data - data that will be displayed in the table
 * - CRUD - crud functions to manipulate the database
 * @param {ITableProps} TableProps
 * @returns Reusable Table JSX Component
 */
const GradeTable = <T extends ISubjects>({
    DATA,
    COLUMNS,
    TableFunctions
}: ITableProps<T>) => {
    // Initialize columns
    const columns = useMemo(() => COLUMNS, [COLUMNS]);

    // Intialize Data
    const data = useMemo(() => DATA, [DATA]);

    const {
        addSubjectHandler: addRowHandler,
        deleteSubjectHandler: deleteRowHandler,
        SaveChangesHandler: updateRowHandler,
        TableColumnsChangeHandler: onTableColumnsChange,
        DeleteTableColumnHandler: onTableColumnDelete
    } = TableFunctions;

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
    const onSubjectsDelete = () => {
        deleteRowHandler(selectedFlatRows.map((row) => {
            return row.original
        }));
    };

    return (
        <div className="py-10">
            {/* ============================== Table Controls ============================== */}
            <div className="flex justify-end space-x-3">
                <button
                    className=""
                    disabled={selectedFlatRows.length === 0}
                    onClick={onSubjectsDelete}
                >
                    <Trash className="h-6 w-6 fill-gray-400 hover:fill-gray-500 cursor-pointer" />
                </button>
                <TableSettings
                    columns={columns}
                    onTableColumnsChange={onTableColumnsChange}
                    onTableColumnDelete={onTableColumnDelete}
                />
            </div>

            {/* ============================== Main table ============================== */}
            <table {...getTableProps({ className: "calculator__table" })}>
                {/* +++++++++++++++++++++ Table Header +++++++++++++++++++++ */}
                <thead>
                    {headerGroups.map((headerGroup, indx) => (
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
                                key={indx}
                                row={row}
                                indx={indx}
                                prepareRow={prepareRow}
                                addSubjectHandler={() => addRowHandler(indx + 1)}
                                updateSubjectHandler={updateRowHandler}
                            />
                        ))
                    ) : (
                        <tr>
                            <td className="no-subjects-row" colSpan={3} onClick={() => addRowHandler()}>
                                {/* TODO: modify to dynamically display the table item besides subjects */}+
                                Add Subject
                            </td>
                        </tr>
                    )}
                </tbody>

                {/* +++++++++++++++++++++ Table Footer +++++++++++++++++++++ */}
                {data.length > 0 && (
                    <tfoot>
                        {footerGroups.map((footerGroup) => (
                            <tr {...footerGroup.getFooterGroupProps()}>
                                {footerGroup.headers.map((column) => (
                                    <td {...column.getFooterProps()}>{column.render("Footer")}</td>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default GradeTable;
