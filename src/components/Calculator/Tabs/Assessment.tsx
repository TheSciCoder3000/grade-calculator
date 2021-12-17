import { useAssessmentDb } from '@useFirebase'
import React from 'react'
import Table, { AssessmentType } from './Table'

type $fixMe = any

// Component prop type
interface IAssessmentProps {
    db: AssessmentType[]
}

// TODO: replace with finalize type that supports the firestore and local storage
// temporary doc type
interface ITempDoc {
    name: string
    assessments: {
            name: string
            items: AssessmentType[]
        }[]
}

const sampleDb: ITempDoc = {
    name: 'T-CPET111',
    assessments: [
        {
            name: 'Enabling Assessment',
            items: [
                {
                    name: 'compound selection',
                    percent: 90,
                    grade: 3.0
                },
                {
                    name: 'While loop',
                    percent: 90,
                    grade: 3.0
                },
                {
                    name: 'Do-While Loop',
                    percent: 90,
                    grade: 3.0
                }
            ]
        },
        {
            name: 'Summative Assessment',
            items: [
                {
                    name: 'summative 1',
                    grade: 2.5
                },
                {
                    name: 'summative 2',
                    grade: 2.75
                }
            ]
        }
    ]
}

const Assessment = () => {
    // const [ db ] = useFirestore('subjects')
    useAssessmentDb()
    const db = sampleDb
    return (
        <div className='assessment-calculator'>
            <div className="subject-dropdown">

            </div>
            <div className="assessment-tables">
                {db.assessments.map((ass, indx) =>
                    <div key={indx} className="item-table">
                        <h3 className="table-title">{ass.name}</h3>
                        <Table docs={ass.items} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Assessment
