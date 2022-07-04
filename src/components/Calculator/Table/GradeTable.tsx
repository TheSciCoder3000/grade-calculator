import { useController } from "@Components/Modal";
import { ISubjects } from "Firebase/FirebaseDb";
import { useMemo, FC } from "react";
import { useTable, useSortBy, useRowSelect, CellProps, Column } from "react-table";
import Checkbox from "./Checkbox";
import SortIcon from "./SortIcon";
import "./Table.css";
import TableRow from "./TableRow";
import { createColumns } from "./utils";

interface ITableProps {
    DATA: ISubjects[];
    yearId: string;
    semId: string;
}

const GradeTable: FC<ITableProps> = ({ DATA, yearId, semId }) => {
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
        hooks.visibleColumns.push((ColumnsInstance) => {
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
                ...ColumnsInstance,
            ];
        });
    });

    const setController = useController();
    const addSubjectHandler = (indx?: number) => {
        setController({ target: "add-subject", data: { yearId, semId, indx } });
    };

    const deleteSubjectsHandler = () => {
        if (selectedFlatRows.length)
            setController({
                target: "delete-subject",
                data: { subject: selectedFlatRows.map((row) => row.original) },
            });
    };

    return (
        <div className="table-cont">
            {/* ============================== Table Controls ============================== */}
            <div className="table-controls">
                <button className="trash" onClick={deleteSubjectsHandler}>
                    Trash
                </button>
                <button className="settings">Settings</button>
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
                            />
                        ))
                    ) : (
                        <tr>
                            <td className="no-subjects-row" colSpan={3} onClick={() => addSubjectHandler()}>
                                + Add Subject
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
