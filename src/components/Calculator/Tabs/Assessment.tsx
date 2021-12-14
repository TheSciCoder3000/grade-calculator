import React from 'react'
import Table, { AssessmentType } from './Table'

type $fixMe = any
interface IAssessmentProps {
    db: AssessmentType[]
}

interface ITempDoc {
    courseName: string
    assessments: [
        {
            name: string
            items: AssessmentType[]
        }
    ]
}

const sampleDb: ITempDoc = {
    courseName: 'T-CPET111',
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
        }
    ]
}

const Assessment = () => {
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
