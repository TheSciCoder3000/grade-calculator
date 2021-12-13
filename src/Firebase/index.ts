import { initializeApp } from "firebase/app";
import { User } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";
import { InitializeAuthentication } from "./FirebaseAuth";
import { useEffect, useState } from "react";
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


// ===================================== Firebase Hooks =====================================

// ============== Auth Status State ==============
// AuthType
export interface FirebaseAuthType {
  AuthStatus: User | null,
  AuthFunctions: {
    AuthSignUp: typeof FirebaseAuth.AuthSignUp
    AuthSignOut: typeof FirebaseAuth.AuthSignOut
    AuthLogIn: typeof FirebaseAuth.AuthLogIn
  }
}
// Auth Hook
export const useFirebaseAuth = () => {
  const [AuthStatus, setAuthStatus] = useState<User | null>(null)
  useEffect(() => {
    FirebaseAuth.AuthStatusListener(setAuthStatus)
  }, [])

  return {
    AuthStatus,
    AuthFunctions: {
      AuthSignUp: FirebaseAuth.AuthSignUp,
      AuthSignOut: FirebaseAuth.AuthSignOut,
      AuthLogIn: FirebaseAuth.AuthLogIn
    }
  }
}