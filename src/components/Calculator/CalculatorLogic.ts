import { IAssessmentDoc, IAssessmetItem, useFirebaseAuth } from "@useFirebase";
import { useEffect, useState } from "react";
import { AssessmentType } from "./Tabs/Table";

var store = require('store')

export interface IDbFunc {
    addSem: ((semName: string) => void) | null
    removeSem: ((semName: string) => void) | null
    addTerm: ((termName: string) => void) | null
    removeTerm: ((termName: string) => void) | null
    addSubject: ((subjectName: string, semName: string) => void) | null
    removeSubject: ((subject: string) => void) | null
    addAssessment: ((subjectName: string, termName: string, assessmentName: string, grade?: number) => void) | null
    removeAssessment: ((subjectName: string, assessmentName: string) => void) | null
}

/**
 * returns a database object and a set of CRUD functions to manipulate the database.
 * It automatically decides wether to use the firestore or the user's local storage.
 */
export const useCalculatorDb = (): [IAssessmentDoc, IDbFunc] => {
    const [db, setDb] = useState<IAssessmentDoc>({} as IAssessmentDoc)

    const [dbFunctions, setDbFunctions] = useState<IDbFunc>({
        addSem: null,
        removeSem: null,
        addTerm: null,
        removeTerm: null,
        addSubject: null,
        removeSubject: null,
        addAssessment: null,
        removeAssessment: null
    })
    const authStatus = useFirebaseAuth()

    useEffect(() => {
        // if user is not authenticated and the database is empty
        if (Object.keys(db).length === 0 && !authStatus.AuthStatus) {
            // check if sems and terms are initialized(new anonymous user)
            !store.get('sems') && store.set('sems', ['1st Semester'])
            !store.get('terms') && store.set('terms', ['Midterm'])

            // update the db state
            setDb({
                sems: store.get('sems'),
                terms: store.get('terms'),
                subjects: store.get('subjects')
            })

            const addSubject = (subjectName: string, semName: string) => {
                !store.get('subjects') && store.set('subjects', [])
                let subjects = store.get('subjects')

                subjects.push({
                    name: subjectName,
                    sem: semName,
                    assessments: []
                })

                setDb(dbState => {
                    let dbCopy = {...dbState}
                    dbCopy.subjects.push({
                        name: subjectName,
                        sem: semName,
                        assessments: []
                    })
                    return dbCopy
                })
            }

            setDbFunctions({
                addSem: (semName: string) => store.set('sems', store.get('sems').push(semName)),
                removeSem: (semName: string) => store.set('sems', store.get('sems').filter((sem: string) => sem !== semName)),
                addTerm: (termName: string) => store.set('terms', store.get('terms').push(termName)),
                removeTerm: (termName: string) => store.set('terms', store.get('terms').filter((term: string) => term !== termName)),
                addSubject: addSubject,
                removeSubject: null,
                addAssessment: null,
                removeAssessment: null
            })
        }
    }, [authStatus])

    return [db, dbFunctions]
}


/**
 * interface returned by the mapAssessmentByType function that restructures the AssessmentItems
 */
interface IAssessmentByType {
    name: string
    items: {
        [x: string]: string | number | null
        name: string
        grade: number | null
    }[]
}

/**
 * function that maps the doc object data into a JSX element by restructuring the object data 
 * and removing the fields `term` and `type`  
 * @param doc raw and unstructured Assessment doc item from the database
 * @param term 
 * @param renderFunc jsx components that maps the restructured doc into a jsx element
 * @returns a jsx element with the mapped values
 */
export const mapAssessmentsByType = (doc: IAssessmetItem[] | null, term: string, renderFunc: (doc: IAssessmentByType, indx?: number) => JSX.Element) => {
    // if doc is null (there is no subject at indx) then return empty array
    if (!doc) return []

    // filter the assessments by the chosen midterm
    let filteredAssessments = doc.find(item => item.name === term)

    // restructure the assessments by its type
    let AssessmentByType = filteredAssessments?.items.reduce((prev, item) => {
        let itemInstance = prev.find(typeItem => typeItem.name === item.type)
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
    }, [] as IAssessmentByType[]) || []

    // map the assessments through the render function if there are subjects filtered
    return AssessmentByType.map(renderFunc)
}

/**
 * toggler hook that returns a stateful boolean value and a function that toggles it to true. It automatically handles the 2nd click to toggle the state to false
 * @returns stateful boolean value and a function that toggles the state to true
 */
export const useSubjToggler = () => {
    const [toggleSubjDropdown, setToggleSubjDropdown] = useState(false)
    const toggleDropdown = () => {
        setToggleSubjDropdown(true)
    }

    useEffect(() => {
        if (!toggleSubjDropdown) return
        const closeDropdown = () => setToggleSubjDropdown(false)
        window.addEventListener('click', closeDropdown)
        
        return () => window.removeEventListener('click', closeDropdown)

    }, [toggleSubjDropdown])

    return [toggleSubjDropdown, toggleDropdown] as [toggleSubjectDropdown: boolean, toggleDropdown: () => void]

}

/**
 * returns an array of the fields filtered by an array of strings
 * @param docs 
 * @param fieldFilters
 */
export const getFilteredFields = (docs: AssessmentType[], fieldFilters: string[]) => {
    // extracts all the fields and combines it into a single array
    let unionDoc = docs.reduce((union, doc) => union.concat(Object.keys(doc)), [] as string[])

    // remove the duplicates by turning it into a set and filtering the fields using the fieldFilter string array
    return [
        ...new Set(unionDoc)
    ].filter(field => !fieldFilters.includes(field))
}