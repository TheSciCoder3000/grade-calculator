// import ls from 'local-storage'

import { IAssessmentDoc, IAssessmetItem, useFirebaseAuth } from "@useFirebase";
import { useEffect, useState } from "react";
import { AssessmentType } from "./Tabs/Table";

/**
 * returns a database object and a set of CRUD functions to manipulate the database.
 * It automatically decides wether to use the firestore or the user's local storage.
 */
export const useCalculatorDb = (): [IAssessmentDoc | null] => {
    const [db, setDb] = useState<IAssessmentDoc | null>(null)
    const authStatus = useFirebaseAuth()

    useEffect(() => {

    }, [])

    return [db]
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
export const mapAssessmentsByType = (doc: IAssessmetItem[] | null, term: string, renderFunc: (doc: IAssessmentByType) => JSX.Element) => {
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