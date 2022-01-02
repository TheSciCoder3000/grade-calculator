// import { IAssessmetItem, useAssessmentDb } from '@useFirebase'
import { IAssessmentDoc } from '@useFirebase'
import { useState } from 'react'
import { IDbFunc, mapAssessmentsByType, useSubjToggler } from '../CalculatorLogic'
import Table from './Table'


interface IAssessment {
    db: IAssessmentDoc
    dbFunc: IDbFunc
}
const Assessment: React.FC<IAssessment> = ({ db, dbFunc }) => {
    // TODO: replace indx method to a more secured reference such as the exact name or value
    const [subjectIndx, setSubjectIndx] = useState(0)

    // initialize custom toggler hook states and function
    const [toggleSubjDropdown, toggleDropdown] = useSubjToggler()

    const [termIndx, setTermIndx] = useState(0)
    const [semIndx, setSemIndx] = useState(0)
    const subjects = db.subjects ? db.subjects.filter(subject => subject.sem === db.sems[semIndx]) : null

    // function that updates the database by subject, and task name

    interface IRefObject {
        subjectName: string
        term: string
        assName: string
    }
    const updateDb = (RefObj: IRefObject, fieldName: string, newValue: string ) => {
        let { subjectName, term, assName } = RefObj
        let dbRef = db.subjects
            .find(subject => subject.name === subjectName)?.assessments
            .find(ass => ass.name === term)?.items
            .find(item => item.name === assName)

        if (dbRef) dbRef[fieldName] = newValue
    }



    return (
        <div className='assessment-calculator'>
            <div className="sem-selection">
                {db.sems && db.sems.map((sem, indx) => 
                    <div key={indx} className={`sem-select ${indx === semIndx && 'active-select'}`} onClick={() => setSemIndx(indx)}>{sem}</div>
                )}
            </div>
            <div className="subject-dropdown">
                <div className="dropdown-selected">
                    <div className="selected-cont">
                        <div className="selected-title">{(subjects && subjects[subjectIndx]?.name) || 'No Subjects'}</div>
                        <button className="dropdown-toggle-btn" onClick={toggleDropdown}></button>
                    </div>
                    <button className="add-selection-btn">+</button>
                </div>
                {toggleSubjDropdown &&
                    <div className="dropdown-menu">
                        {subjects?.map((subject, indx) => indx !== subjectIndx &&
                            <div key={indx} className="dropdown-menu-item" onClick={() => setSubjectIndx(indx)}>{subject.name}</div>    
                        )}
                    </div>
                }
            </div>
            <div className="subject-details">
                <div className="term-selection">
                    {db.terms && db.terms.map((term, indx) =>
                        <div key={indx} className={`term-select ${indx === termIndx && 'active-select'}`} onClick={() => setTermIndx(indx)}>{term}</div>
                    )}
                </div>
                <div className="assessment-tables">
                    {subjects && mapAssessmentsByType(subjects[subjectIndx]?.assessments, db.terms[termIndx], (assDoc, indx) => 
                        <div key={indx} className="table-data">
                            <h3 className="table-title">{assDoc.name}</h3>
                            <Table docs={assDoc.items} updateDb={updateDb} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Assessment