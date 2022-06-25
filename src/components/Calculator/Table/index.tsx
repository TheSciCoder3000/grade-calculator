import { useController } from "@Components/Modal";
import { ISubjects } from "Firebase/FirebaseDb";
import { useMemo, FC } from "react";
import { useTable, useSortBy, useRowSelect, CellProps, Column } from "react-table";
import Checkbox from "./Checkbox";
import SortIcon from "./SortIcon";
import "./Table.css";
import { createColumns } from "./utils";

interface ITableProps {
    DATA: ISubjects[];
}

const GradeTable: FC<ITableProps> = ({ DATA }) => {
    // Initialize columns
    const columns = useMemo(() => createColumns(DATA) as Column<ISubjects>[], [DATA]);

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
    } = useTable({ columns, data }, useSortBy, useRowSelect, (hooks) => {
        hooks.visibleColumns.push((columns) => {
            return [
                {
                    id: "selection",
                    Header: ({ getToggleAllRowsSelectedProps }) => {
                        return (
                            <Checkbox
                                {...getToggleAllRowsSelectedProps()}
                                rowId={"header"}
                                header={true}
                                className="header-checkbox"
                            />
                        );
                    },
                    Cell: ({ row }: React.PropsWithChildren<CellProps<ISubjects, any>>) => {
                        return <Checkbox {...row.getToggleRowSelectedProps()} rowId={row.original.id} />;
                    },
                },
                ...columns,
            ];
        });
    });

    const setController = useController();
    const addSubjectHandler = () => {
        setController("add-subject");
    };

    return (
        <table {...getTableProps({ className: "calculator__table" })}>
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
                    </tr>
                ))}
            </thead>

            <tbody {...getTableBodyProps()}>
                {rows.length > 0 ? (
                    rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                ))}
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td className="no-subjects-row" colSpan={3} onClick={addSubjectHandler}>
                            + Add Subject
                        </td>
                    </tr>
                )}
            </tbody>

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
    );
};

export default GradeTable;
