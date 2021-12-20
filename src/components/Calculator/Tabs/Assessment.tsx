// import { IAssessmetItem, useAssessmentDb } from '@useFirebase'
import { useState } from 'react'
import { mapAssessmentsByType, useSubjToggler } from '../CalculatorLogic'
import { fakeDbData } from './fakeData'
import Table from './Table'


const Assessment = () => {
    const db = fakeDbData // useAssessmentDb()
    const [subjectIndx, setSubjectIndx] = useState(0)
    const [toggleSubjDropdown, toggleDropdown] = useSubjToggler()
    const [termIndx, setTermIndx] = useState(0)
    const [semIndx, setSemIndx] = useState(0)
    const subjects = db.subjects ? db.subjects.filter(subject => subject.sem === db.sems[semIndx]) : null
    console.log('subjects', db.subjects[subjectIndx])



    return (
        <div className='assessment-calculator'>
            <div className="sem-selection">
                {db.sems && db.sems.map((sem, indx) => 
                    <div className={`sem-select ${indx === semIndx && 'active-select'}`} onClick={() => setSemIndx(indx)}>{sem}</div>
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
                            <div className="dropdown-menu-item" onClick={() => setSubjectIndx(indx)}>{subject.name}</div>    
                        )}
                    </div>
                }
            </div>
            <div className="subject-details">
                <div className="term-selection">
                    {db.terms && db.terms.map((term, indx) =>
                        <div className={`term-select ${indx === termIndx && 'active-select'}`} onClick={() => setTermIndx(indx)}>{term}</div>
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
