import { IAssessmetItem, useAssessmentDb } from '@useFirebase'
import { useState } from 'react'
import Table from './Table'



const Assessment = () => {
    const db = useAssessmentDb()
    const [subjectIndx, setSubjectIndx] = useState(0)
    const [termIndx, setTermIndx] = useState(0)
    const [semIndx, setSemIndx] = useState(0)
    const subjects = db.subjects ? db.subjects.filter(subject => subject.sem == db.sems[semIndx]) : null
    // console.log('subjects', db.subjects)

    interface IAssessmentByType {
        name: string
        items: {
            [x: string]: string | number | null
            name: string
            grade: number | null
        }[]
    }
    const mapAssessmentsByType = (doc: IAssessmetItem[] | null, term: string, renderFunc: (doc: IAssessmentByType) => JSX.Element) => {
        // if doc is null (there is no subject at indx) then return empty html
        if (!doc) return <></>

        // filter the assessments by the chosen midterm
        let filteredAssessments = doc.find(item => item.name == term)

        // restructure the assessments by its type
        let AssessmentByType = filteredAssessments?.items.reduce((prev, item) => {
            let itemInstance = prev.find(typeItem => typeItem.name == item.type)
            let { type, term, ...itemCopy } = item
            if (itemInstance) {
                itemInstance.items.push(itemCopy)
            } else {
                prev.push({
                    name: item.type,
                    items: [itemCopy]
                })
            }
            
            return prev
        }, [] as IAssessmentByType[])

        // map the assessments through the render function if there are subjects filtered
        if (AssessmentByType) return AssessmentByType.map(renderFunc)
    }

    return (
        <div className='assessment-calculator'>
            <div className="sem-selection">
                {db.sems && db.sems.map((sem, indx) => 
                    <div className={`sem-select ${indx == semIndx && 'active-select'}`} onClick={() => setSemIndx(indx)}>{sem}</div>
                )}
            </div>
            <div className="subject-dropdown">{subjects ? subjects[subjectIndx]?.name : undefined}</div>
            <div className="subject-details">
                <div className="term-selection">
                    {db.terms && db.terms.map((term, indx) =>
                        <div className={`term-select ${indx == termIndx && 'active-select'}`} onClick={() => setTermIndx(indx)}>{term}</div>
                    )}
                </div>
                <div className="assessment-tables">
                    {subjects && mapAssessmentsByType(subjects[subjectIndx]?.assessments, db.terms[termIndx], assDoc => 
                        <div className="table-data">
                            <h3 className="table-title">{assDoc.name}</h3>
                            <Table docs={assDoc.items} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Assessment
