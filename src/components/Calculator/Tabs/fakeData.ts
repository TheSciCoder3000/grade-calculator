import { IAssessmentDoc } from "@useFirebase";

export const fakeDbData: IAssessmentDoc = {
    terms: ['Midterm', 'Final'],
    sems: ['1st Semester', '2nd Semester'],
    subjects: [
        {
            name: 'T-CPET111',
            sem: '1st Semester',
            assessments: [
                {
                    name: 'Midterm',
                    items: [
                        {
                            name: 'compound selection',
                            grade: 3.0,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'do while loop',
                            grade: 2.75,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'while loop',
                            grade: 3.25,
                            type: 'Summative Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'IO Exercises',
                            grade: 3.50,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'Real life project',
                            grade: 3.0,
                            type: 'Summative Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'Sample Exercises',
                            grade: 3.0,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                    ]
                },
                {
                    name: 'Final',
                    items: [
                        {
                            name: 'selection',
                            grade: 2.75,
                            type: 'Class Participation',
                            term: 'Midterm'
                        },
                        {
                            name: 'selection',
                            grade: 2.75,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'selection',
                            grade: 2.75,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'selection',
                            grade: 2.75,
                            type: 'Summative Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'selection',
                            grade: 2.75,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                    ]
                }
            ]
        },
        {
            name: 'S-ECHE001',
            sem: '1st Semester',
            assessments: [
                {
                    name: 'Midterm',
                    items: [
                        {
                            name: 'electro chemistry',
                            grade: 3.0,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'research paper',
                            grade: 2.75,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'while loop',
                            grade: 3.25,
                            type: 'Summative Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'corossion',
                            grade: 3.50,
                            type: 'Summative Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'Real life project',
                            grade: 3.0,
                            type: 'Class participation',
                            term: 'Midterm'
                        },
                        {
                            name: 'Sample Exercises',
                            grade: 3.0,
                            type: 'Class participation',
                            term: 'Midterm'
                        },
                    ]
                },
                {
                    name: 'Final',
                    items: [
                        {
                            name: 'quiz game',
                            grade: 2.75,
                            type: 'Class Participation',
                            term: 'Midterm'
                        },
                        {
                            name: 'another research paper',
                            grade: 2.75,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'teams activity',
                            grade: 2.75,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'exam',
                            grade: 2.75,
                            type: 'Summative Assessment',
                            term: 'Midterm'
                        },
                        {
                            name: 'selection',
                            grade: 2.75,
                            type: 'Enabling Assessment',
                            term: 'Midterm'
                        },
                    ]
                }
            ]
        }
    ]

}
