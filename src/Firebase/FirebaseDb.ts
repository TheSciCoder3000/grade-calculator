import { getFirestore, doc, setDoc, getDoc, onSnapshot, Unsubscribe, query, collection, where } from 'firebase/firestore'
import { FirebaseApp } from 'firebase/app'
import React from 'react'

type $fixMe = any
type ReactSetState = React.Dispatch<React.SetStateAction<$fixMe>>
export interface ISubject {
    name: string // coourse name
    assessments: {
        name: string // Assessment name (ex. Enabling Assessment)
        sem: string
        term: string
        grade: number | null
        type: string
        [x: string]: string | number | null
    }[]
}
export interface IUserDoc {
    userUid: string
    subjects: ISubject[]
}

export type DbUnsubscribe = Unsubscribe

export function initializeFirestore(app: FirebaseApp) {
    // Get the Firestore Instance
    const db = getFirestore(app)
    const dbDocRef = (userUid: string) => doc(db, 'users', userUid)

    // Create User Db (when creating|signing up a new user)
    const createUserDb = async (userUid: string) => {
        // initialize the User Doc Data
        let docData: IUserDoc = {
            userUid,
            subjects: []
        }

        return setDoc(dbDocRef(userUid), docData)
    }

    // get document once
    const getInitialDb = async (userUid: string) => {
        return getDoc(dbDocRef(userUid)).then(res => {
            console.log('user db', res)
            return res
        })
    }

    // update document

    // subscribe to changes in document
    // TODO: Fix setDbData data type
    const onDbChanges = (userUid: string, setDbData: any) => {
        // console.log('running listener')
        // onSnapshot(query(collection(db, `/users/${userUid}/subjects/T-CPET111/assessments`), where('sem', '==', '1')), (snapshot) => {
        //     // setDbData(snapshot)
        //     console.log('db change detected ver 1')
        //     console.log('changes: ', snapshot.forEach(doc => console.log('doc', doc.data())))
        //     console.log('snapshot', snapshot.docs)
        // })
        return onSnapshot(dbDocRef(userUid), (snapshot) => {
            const docData = snapshot.data() as IUserDoc
            setDbData(docData)
            console.log('db change detected')
            console.log('new data: ', snapshot.data())
        })
    }

    return { createUserDb, getInitialDb, onDbChanges }
}