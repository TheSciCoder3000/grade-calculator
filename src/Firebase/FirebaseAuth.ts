import { FirebaseApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, User, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import React from 'react'


// ================================== Type Definitions ==================================
export function InitializeAuthentication(app: FirebaseApp, createUserDb: (userUid: string) => Promise<void>) {
    const auth = getAuth(app)

    const AuthStatusListener = (setUserStatus: React.Dispatch<React.SetStateAction<User | null>>) => auth.onAuthStateChanged(user => setUserStatus(user))

    const AuthSignUp = async (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
                createUserDb(userCredential.user.uid)
                return userCredential.user
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(`${errorCode}: ${errorMessage}`)
                return null
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
                return userCredentials.user
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(`${errorCode}: ${errorMessage}`)
                return null
            })
    }

    return { AuthSignUp, AuthLogIn, AuthSignOut, AuthStatusListener }
}