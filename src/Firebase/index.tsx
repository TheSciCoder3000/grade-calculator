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
/**
 * creates a dictionary of the user's authentication with auth-related functions
 * Functions include:
 * - signing up
 * - signing out
 * - loging in
 * - listening to authentication changes
 */
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

/**
 * creates a dictionary of the data from the database and database-related functions such as:
 * - Adding documents
 * - removing documents
 * - updating documents
 * - listening to changes
 */
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
type FireContextItemArrayType = FireContextReturnType[1]
type FireFunc = Extract<FireContextItemArrayType, Function>
type FireObj = Exclude<FireContextItemArrayType, Function>
type FirestoreContextType = [FireObj, FireFunc]

export interface IFirebaseContext {
  Auth: ReturnType<typeof useAuthContext>
  Firestore: FirestoreContextType[0]
}

/**
 * firebase context for providing states across nested components
 */
const FirebaseContext = createContext<IFirebaseContext>({
  Auth: {} as ReturnType<typeof useAuthContext>,
  Firestore: {} as FirestoreContextType[0]
})


interface IFirebaseContextProvider {
  children: JSX.Element
}

/**
 * Firebase Context provideer component
 */
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


// ============================ Firebase Hooks ============================

const useFirebase = () => useContext(FirebaseContext)

/**
 * Firebase auth hook for accessing the data stored in the FirebaseContext Provider
 * @returns Auth object containing the user credentials and auth-related functions
 */
export const useFirebaseAuth = () => useFirebase().Auth

/**
 * Firebase firestore hook for accessing the data stored in the FirebaseContext Provider
 * @returns Firestore object containing the database data and database-related functions
 */
export const useFirestore = () => useFirebase().Firestore

/**
 * interface of the object returned from the useAssessmentDb hook
 */
interface IAssessmentDoc {
  sems: string[]
  terms: string[]
  subjects: {
    name: string
    sem: string         // key that's going to be filtered 
    assessments: IAssessmetItem[]
  }[]
}
/**
 * an assessment item type interface of the type/category of the assessment and the items under it
 */
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

/**
 * Assessment db hook used to access and restructure the data from the firestore into a component usable object
 * @returns object that is compatible to be used by the assessment component
 */
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