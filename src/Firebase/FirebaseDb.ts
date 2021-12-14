import { getFirestore, doc, setDoc, getDoc, onSnapshot, Unsubscribe, query, collection, where } from 'firebase/firestore'
import { FirebaseApp } from 'firebase/app'

interface ISubject {
    name: string
    score: number
    totalScore: number
    percent: number
}
interface IGradingSys {
    name: string
    category: {
        name: string
        percent: number
        variation: {
            name: string
            percent: number
        }[]
    }[]
}
interface IUserDoc {
    userUid: string
    subjects: ISubject[]
    gradingSys: IGradingSys[]
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
            subjects: [],
            gradingSys: []
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
        console.log('running listener')
        onSnapshot(query(collection(db, 'users'), where('userUid', '==', userUid)), (snapshot) => {
            setDbData(snapshot)
            console.log('db change detected ver 1')
            console.log('changes: ', snapshot.docChanges())
        })
        return onSnapshot(dbDocRef(userUid), (snapshot) => {
            setDbData(snapshot)
            console.log('db change detected')
            console.log('new data: ', snapshot.data())
        })
    }

    return { createUserDb, getInitialDb, onDbChanges }
}