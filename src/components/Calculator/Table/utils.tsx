import { Hooks, CellProps } from "react-table";
import Checkbox from "./Checkbox";

/**
 * Selection hook used to add the checkbox component to the table
 * @param hooks
 */
export const selectionHook = <T extends { id: string }>(hooks: Hooks<T>) => {
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
                Cell: ({ row }: React.PropsWithChildren<CellProps<T, any>>) => {
                    return <Checkbox {...row.getToggleRowSelectedProps()} rowId={row.original.id} />;
                },
            },
            ...ColumnsInstance,
        ];
    });
};
