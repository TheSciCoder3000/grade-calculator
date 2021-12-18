import { createContext, useContext, useEffect, useState } from "react";

import { initializeApp } from "firebase/app";
import { User } from 'firebase/auth'
// import { getAnalytics } from "firebase/analytics";

import { InitializeAuthentication } from "./FirebaseAuth";
import { initializeFirestore, IUserDoc } from "./FirebaseDb";
import { unstable_batchedUpdates } from "react-dom";
import { stringify } from "querystring";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyDR7cy9pg18k1hEhbKkFgG9wNM5T6CcFvY",
  authDomain: "grade-calculator-3000.firebaseapp.com",
  projectId: "grade-calculator-3000",
  storageBucket: "grade-calculator-3000.appspot.com",
  messagingSenderId: "565775310347",
  appId: "1:565775310347:web:7d2abca2387076bf45b10e",
  measurementId: "G-8DV6VP5YXG"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const FirebaseDb = initializeFirestore(app)
const FirebaseAuth = InitializeAuthentication(app, FirebaseDb.createUserDb)


// ===================================== Firebase Context Values =====================================
// Auth Values
const useAuthContext = () => {
  // auth module states
  const [AuthStatus, setAuthStatus] = useState<User | null>(null)

  // Add auth status listener after rendering component
  useEffect(() => FirebaseAuth.AuthStatusListener(setAuthStatus), [])


  return {
    AuthStatus,
    AuthFunctions: {
      AuthSignUp: FirebaseAuth.AuthSignUp,
      AuthSignOut: FirebaseAuth.AuthSignOut,
      AuthLogIn: FirebaseAuth.AuthLogIn,
      AuthListener: FirebaseAuth.AuthStatusListener
    }
  }
}

// Firestore Values
const useFirestoreContext = () => {
  // Firestore module state
  const [FirestoreDb, setFirestoreDb] = useState<IUserDoc>({} as IUserDoc)
  

  const updateFirestoreDb = (userUid: string) => {
    return FirebaseDb.onDbChanges(userUid, setFirestoreDb)
  }

  return [
    {
      Firestore: FirestoreDb,
      FirestoreFunctions: {
        AddDocs: null,
        RemoveDocs: null,
        UpdateDocs: null,
        onDocsChange: null
      }
    },
    updateFirestoreDb
  ] 
  
}

// ===================================== Firebase Context Creation =====================================
type FireContextReturnType = ReturnType<typeof useFirestoreContext>
type RawFireContextType = FireContextReturnType[1]
type FireFunc = Extract<RawFireContextType, Function>
type FireObj = Exclude<RawFireContextType, Function>
type FirestoreContextType = [FireObj, FireFunc]

interface IFirebaseContext {
  Auth: ReturnType<typeof useAuthContext>
  Firestore: FirestoreContextType[0]
}
const FirebaseContext = createContext<IFirebaseContext>({
  Auth: {} as ReturnType<typeof useAuthContext>,
  Firestore: {} as FirestoreContextType[0]
})


interface IFirebaseContextProvider {
  children: JSX.Element
}
// Firebase Context Provider
export const FirebaseConetxtProvider: React.FC<IFirebaseContextProvider> = ({ children }) => {
  const FirebaseAuth = useAuthContext()
  const [Firestore, updateFirestore] = useFirestoreContext() as FirestoreContextType

  useEffect(() => {
    if (FirebaseAuth.AuthStatus && typeof updateFirestore == 'function') return updateFirestore(FirebaseAuth.AuthStatus.uid)
  }, [FirebaseAuth.AuthStatus])
  return (
    <FirebaseContext.Provider value={{
      Auth: FirebaseAuth,
      Firestore: Firestore
    }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export type FirebaseType = ReturnType<typeof useFirebase>


// ============================ Firebase Hooks ============================

export const useFirebase = () => useContext(FirebaseContext)

export const useFirebaseAuth = () => useFirebase().Auth




export const useFirestore = () => useFirebase().Firestore

export interface IAssessmetItem {
  name: string
  items: {
    name: string
    grade: number | null
    type: string
    term: string          // key that's going to be filtered
    [x: string]: number | string | null
  }[]
}
interface IAssessmentDoc {
  sems: string[]
  terms: string[]
  subjects: {
    name: string
    sem: string         // key that's going to be filtered 
    assessments: IAssessmetItem[]
  }[]
}
export const useAssessmentDb = (): IAssessmentDoc => {
  const unStructuredDoc = useFirebase().Firestore.Firestore
  // return an empty array if the firestore context is null or undefined
  if (!unStructuredDoc) return {} as IAssessmentDoc

  // initialize an array of sems
  let sems = unStructuredDoc.sems

  // initialize an array of terms
  let terms = unStructuredDoc.terms

  return {
    sems,
    terms,
    subjects: unStructuredDoc.subjects?.map(subject => {
      return {
        name: subject.name,
        sem: subject.sem,
        assessments: terms.map(termName => {
          return {
            name: termName,
            items: subject.assessments.filter(assessment => assessment.term == termName).map(assessment => {
              let { type, ...copy } = assessment
              return assessment
            })
          }
        })
      }
    })
  }
}