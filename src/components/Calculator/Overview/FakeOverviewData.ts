export const FakeYearData = [
    {
        id: "year1",
        name: "1st Year",
        sems: [
            {
                id: "sem1",
                name: "1st sem",
            },
            {
                id: "sem2",
                name: "2ns sem",
            },
        ],
    },
];

export const FakeSubjectData = [
    {
        id: "subject_Emat",
        name: "EMAT",
        sem: "sem1",
        year: "year1",
        extra: [
            {
                id: "diff_extra",
                value: "Medium",
            },
        ],
        grades: [
            {
                id: "midterm_grades",
                value: 92,
            },
            {
                id: "Finals_grades",
                value: 91,
            },
        ],
    },
    {
        id: "subject_Cpet",
        name: "CPET121",
        sem: "sem1",
        year: "year1",
        extra: [
            {
                id: "diff_extra",
                value: "Easy",
            },
        ],
        grades: [
            {
                id: "midterm_grades",
                value: 94,
            },
            {
                id: "Finals_grades",
                value: 97,
            },
        ],
    },
    {
        id: "subject_Engm",
        name: "ENGM",
        sem: "sem1",
        year: "year1",
        extra: [
            {
                id: "diff_extra",
                value: "Medium",
            },
        ],
        grades: [
            {
                id: "midterm_grades",
                value: 95,
            },
            {
                id: "Finals_grades",
                value: 93,
            },
        ],
    },
];

export const FakeTableColumns = {
    overview: {
        grades: [
            {
                id: "midterm_grades",
                name: "Midterm",
            },
            {
                id: "Finals_grades",
                name: "Finals",
            },
        ],
        extra: [
            {
                id: "diff_extra",
                name: "Difficulty",
            },
        ],
    },
    details: {},
};
