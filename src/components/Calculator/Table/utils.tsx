import { ISubjects } from "Firebase/FirebaseDb";
import CourseCellLink from "./CourseLink";

interface IRow {
    original: ISubjects;
    values: {
        name: string;
        [field: string]: string | number;
    };
}

interface IColumn {
    Header: string;
    accessor: string | ((doc: ISubjects) => number | string);
    Cell?: string | ((cell: { row: IRow }) => JSX.Element | string);
    Footer?: string | ((row: { rows: IRow[] }) => JSX.Element | string);
}

type CreateColumnType = (subjects: ISubjects[]) => IColumn[];
export const createColumns: CreateColumnType = (subjects) => {
    const blueprint = subjects[0] || {
        grades: [
            {
                name: "Midterm",
                value: 0,
            },
        ],
    };
    return [
        {
            Header: "Course Name",
            accessor: "name",
            Cell: (cell) => {
                const value = cell.row.original;
                return <CourseCellLink courseName={value.name} courseId={value.id} />;
            },
            Footer: "Average",
        },
        ...(blueprint.extra
            ? blueprint.extra.map((extra, indx) => {
                  return {
                      Header: extra.name,
                      accessor: (doc) => doc.extra?.find((item) => item.name === extra.name)?.value,
                      Cell: ({ row }) => row.values[extra.name],
                  } as IColumn;
              })
            : []),
        ...blueprint.grades.map((grade) => {
            return {
                Header: grade.name,
                accessor: (doc) => doc.grades.find((item) => item.name === grade.name)?.value,
                Cell: ({ row }) => row.values[grade.name],
                Footer: ({ rows }) => {
                    const sum = rows.reduce((partialSum, row) => {
                        const rowVal = row.values[grade.name] as number;
                        return partialSum + rowVal;
                    }, 0);
                    return <>{(sum / rows.length).toFixed(2) || 0}</>;
                },
            } as IColumn;
        }),
    ];
};
