// import ls from 'local-storage'

import { IAssessmetItem, useFirebaseAuth, useFirestore } from "@useFirebase";
import { useState } from "react";

export function useCalculatorDb() {

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
 * function that maps the Assessment into a component-compatible object 
 * @param doc raw and unstructured Assessment doc item from the database
 * @param term 
 * @param renderFunc jsx components that maps the restructured doc into a jsx element
 * @returns a jsx element with the mapped values
 */
export const mapAssessmentsByType = (doc: IAssessmetItem[] | null, term: string, renderFunc: (doc: IAssessmentByType) => JSX.Element) => {
    // if doc is null (there is no subject at indx) then return empty html
    if (!doc) return

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
    }, [] as IAssessmentByType[])

    // map the assessments through the render function if there are subjects filtered
    if (AssessmentByType) return AssessmentByType.map(renderFunc)
}