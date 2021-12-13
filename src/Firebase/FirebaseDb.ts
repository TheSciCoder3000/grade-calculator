import { getFirestore, doc, setDoc } from 'firebase/firestore'
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

export function initializeFirestore(app: FirebaseApp) {
    // Get the Firestore Instance
    const db = getFirestore(app)

    // Create User Db (when creating|signing up a new user)
    const createUserDb = async (userUid: string) => {
        // initialize the User Doc Data
        let docData: IUserDoc = {
            userUid,
            subjects: [],
            gradingSys: []
        }

        return setDoc(doc(db, 'users', userUid), docData)
    }

    return { createUserDb }
}