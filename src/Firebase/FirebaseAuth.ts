import { FirebaseApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, User, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import React from 'react'


// ================================== Type Definitions ==================================
export function InitializeAuthentication(app: FirebaseApp) {
    const auth = getAuth()

    const AuthStatusListener = (setUserStatus: React.Dispatch<React.SetStateAction<User | null>>) => auth.onAuthStateChanged(user => setUserStatus(user))

    const AuthSignUp = async (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
                return userCredential
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(`${errorCode}: ${errorMessage}`)
            });
    }

    const AuthSignOut = async () => {
        console.log('signing out')
        return signOut(auth)
    }

    const AuthLogIn = async (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                console.log('User has successfuly logged in')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(`${errorCode}: ${errorMessage}`)
            })
    }

    return { AuthSignUp, AuthLogIn, AuthSignOut, AuthStatusListener }
}