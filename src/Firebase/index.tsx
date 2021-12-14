import { createContext, useContext, useEffect, useState } from "react";

import { initializeApp } from "firebase/app";
import { User } from 'firebase/auth'
// import { getAnalytics } from "firebase/analytics";

import { InitializeAuthentication } from "./FirebaseAuth";
import { initializeFirestore } from "./FirebaseDb";

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
  useEffect(() => {
    FirebaseAuth.AuthStatusListener(user => {
      setAuthStatus(user)

    })
  }, [])

  const onFirebaseLogOut = () => {
    console.log('unsubscribing db events')
    FirebaseAuth.AuthSignOut()
  }

  return {
    AuthStatus,
    AuthFunctions: {
      AuthSignUp: FirebaseAuth.AuthSignUp,
      AuthSignOut: onFirebaseLogOut,
      AuthLogIn: FirebaseAuth.AuthLogIn,
      AuthListener: FirebaseAuth.AuthStatusListener
    }
  }
}

// Firestore Values
const useFirestoreContext = () => {
  type $fixMe = any
  // Firestore module state
  const [FirestoreDb, setFirestoreDb] = useState<$fixMe>(null)
  
  useEffect(() => {
    
  }, [])

  return {
    Firestore: FirestoreDb,
    FirestoreFunctions: {
      AddDocs: null,
      RemoveDocs: null,
      UpdateDocs: null,
      onDocsChange: null
    }
  }
}

// ===================================== Firebase Context Creation =====================================
interface IFirebaseContext {
  Auth: ReturnType<typeof useAuthContext>
  Firestore: ReturnType<typeof useFirestoreContext>
}
const FirebaseContext = createContext<IFirebaseContext>({
  Auth: {} as ReturnType<typeof useAuthContext>,
  Firestore: {} as ReturnType<typeof useFirestoreContext>
})


interface IFirebaseContextProvider {
  children: JSX.Element
}
// Firebase Context Provider
export const FirebaseConetxtProvider: React.FC<IFirebaseContextProvider> = ({ children }) => {
  const FirebaseAuth = useAuthContext()
  const Firestore = useFirestoreContext()
  return (
    <FirebaseContext.Provider value={{
      Auth: FirebaseAuth,
      Firestore: Firestore
    }}>
      {children}
    </FirebaseContext.Provider>
  )
}

// Firebase Hook
export const useFirebase = () => useContext(FirebaseContext)

export const useFirebaseAuth = () => useFirebase().Auth

export type FirebaseType = ReturnType<typeof useFirebase>