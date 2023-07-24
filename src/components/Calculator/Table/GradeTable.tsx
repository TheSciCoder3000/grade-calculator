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
        <div className="py-10 space-y-3">
            {/* ============================== Table Controls ============================== */}
            <div className="flex justify-end space-x-3">
                <button
                    className="fill-gray-400 hover:fill-gray-500 cursor-pointer disabled:cursor-not-allowed disabled:fill-gray-300"
                    disabled={selectedFlatRows.length === 0}
                    onClick={onSubjectsDelete}
                >
                    <Trash className="h-6 w-6" />
                </button>
                <TableSettings
                    columns={columns}
                    onTableColumnsChange={onTableColumnsChange}
                    onTableColumnDelete={onTableColumnDelete}
                />
            </div>

            {/* ============================== Main table ============================== */}
            <div className="">
                <table {...getTableProps({ className: "border-separate border-spacing-y-4 w-full" })}>
                    {/* +++++++++++++++++++++ Table Header +++++++++++++++++++++ */}
                    <thead className="h-12">
                        {headerGroups.map((headerGroup, indx) => (
                            <tr {...headerGroup.getHeaderGroupProps({
                                className: "bg-green-500 text-white" 
                            })}>
                                {headerGroup.headers.map((column, indx) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        <div className="flex pl-4 pr-4 items-center justify-between">
                                            {column.render("Header")}
                                            <span className="ml-4 fill-white">
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
                                {/* <th></th> */}
                            </tr>
                        ))}
                    </thead>

                    {/* +++++++++++++++++++++ Table Body +++++++++++++++++++++ */}
                    <tbody {...getTableBodyProps({ className: "space-y-4" })}>
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
                                <td colSpan={columns.length + 1} onClick={() => addRowHandler()}>
                                    <div className="flex justify-center items-center text-gray-500 hover:text-gray-400 hover:bg-gray-50 col-span-3 hover:cursor-pointer border rounded-md shadow p-3">
                                        {/* TODO: modify to dynamically display the table item besides subjects */}+
                                        Add Subject
                                    </div>
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
                                        <td {...column.getFooterProps({ className: "pl-4 pt-4 border-t-2" })}>{column.render("Footer")}</td>
                                    ))}
                                </tr>
                            ))}
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
};

export default GradeTable;
