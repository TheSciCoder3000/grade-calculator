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


// ===================================== Firebase Context Creation =====================================
export interface IFirebaseContext {
  Auth: ReturnType<typeof useAuthContext>
}
interface IFirebaseContextProvider {
  children: JSX.Element
}

/**
 * firebase context for providing states across nested components
 */
const FirebaseContext = createContext<IFirebaseContext>({
  Auth: {} as ReturnType<typeof useAuthContext>
})

/**
 * Firebase Context provideer component
 */
export const FirebaseConetxtProvider: React.FC<IFirebaseContextProvider> = ({ children }) => {
  const FirebaseAuth = useAuthContext()

  return (
    <FirebaseContext.Provider value={{
      Auth: FirebaseAuth,
    }}>
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