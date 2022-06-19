import { createContext, useContext, useEffect, useState } from "react";

import { initializeApp } from "firebase/app";
import { User } from 'firebase/auth'
// import { getAnalytics } from "firebase/analytics";

import { InitializeAuthentication } from "./FirebaseAuth";
import { initializeFirestore, IUserDoc } from "./FirebaseDb";

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
const FirebaseAuth = InitializeAuthentication(app)


// ===================================== Firebase Context Values =====================================
export type AuthStatusType = User | null
export type AuthFunctionType = ReturnType<typeof useAuthContext>['AuthFunctions']
export type SignOutType = typeof FirebaseAuth.AuthSignOut
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
  const [AuthStatus, setAuthStatus] = useState<AuthStatusType>(null)

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
 * creates a dictionary of the user's database with database-related functions
 * Functions include:
 * - creating user's intial database (on sign up)
 * - fetching user's initial data
 * - setting user's data
 * @param userId 
 * @returns 
 */
const useFirestoreGrade = (userId: string | null | undefined) => {
  // initialize userData state
  const [userData, setUserData] = useState<IUserDoc | null>(null)

  // destructure firebaseDb functions
  const { dbListener, ...FirestoreFunctions } = FirebaseDb

  // subscribe to firestore event listener and updates userData state on update
  useEffect(() => {
    if (userId) return FirebaseDb.dbListener(userId, (doc) => setUserData(doc.data() as IUserDoc))
  }, [userId])    // enable, disable or change the listener when userId value changes

  return {
    /**
     * object containing the user's firestore data.
     * **This updates every time changes within the firestore occurs.**
     */
    userData,
    dbFunctions: { ...FirestoreFunctions }
  }
}


// ===================================== Firebase Context Creation =====================================
interface IFirebaseContext {
  Auth: ReturnType<typeof useAuthContext>
  Firestore: ReturnType<typeof useFirestoreGrade>
}
interface IFirebaseContextProvider {
  children: JSX.Element
}

/**
 * firebase context for providing states across nested components
 */
const FirebaseContext = createContext<IFirebaseContext>({
  Auth: {} as ReturnType<typeof useAuthContext>,
  Firestore: {} as ReturnType<typeof useFirestoreGrade>
})

/**
 * Firebase Context provideer component
 */
export const FirebaseConetxtProvider: React.FC<IFirebaseContextProvider> = ({ children }) => {
  const Auth = useAuthContext()
  const Firestore = useFirestoreGrade(Auth.AuthStatus?.uid)

  return (
    <FirebaseContext.Provider value={{ Auth, Firestore }}>
      {children}
    </FirebaseContext.Provider>
  )
}


// ===================================== Firebase Hooks =====================================

const useFirebase = () => useContext(FirebaseContext)

/**
 * Firebase auth hook for accessing the data stored in the FirebaseContext Provider
 * @returns Auth object containing the user credentials and auth-related functions
 */
export const useFirebaseAuth = () => useFirebase().Auth

/**
 * Firbase firestore/db hook for accessing the functions to manipulate the database
 * @returns Firestore object containing the db functions for manipulating the firestore database
 */
export const useFirestore = () => useFirebase().Firestore