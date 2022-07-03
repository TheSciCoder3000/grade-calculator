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
    let ExtraBlueprint = new Set<string>();
    let GradesBlueprint = new Set<string>();
    subjects.forEach((subject) => {
        subject.grades.forEach((grade) => {
            GradesBlueprint.add(grade.name);
        });
        subject.extra?.forEach((extra) => {
            ExtraBlueprint.add(extra.name);
        });
    });

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
        ...[...ExtraBlueprint].map((extra, indx) => {
            return {
                Header: extra,
                accessor: (doc) => doc.extra?.find((item) => item.name === extra)?.value,
                Cell: ({ row }) => row.values[extra] || "",
            } as IColumn;
        }),
        ...[...GradesBlueprint].map((grade) => {
            return {
                Header: grade,
                accessor: (doc) => doc.grades.find((item) => item.name === grade)?.value,
                Cell: ({ row }) => row.values[grade],
                Footer: ({ rows }) => {
                    const sum = rows.reduce((partialSum, row) => {
                        const rowVal = row.values[grade] as number;
                        return partialSum + rowVal;
                    }, 0);
                    return <>{(sum / rows.length).toFixed(2) || 0}</>;
                },
            } as IColumn;
        }),
    ];
};
