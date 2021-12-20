import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { IFirebaseContext } from '@useFirebase'
import Login from './AuthActions/Login'
import LogOut from './AuthActions/LogOut'
import SignUp from './AuthActions/SignUp'

import './css/Auth.css'

interface AuthProps {
    AuthFunctions: IFirebaseContext['Auth']['AuthFunctions']
}

const Auth: React.FC<AuthProps> = ({ AuthFunctions }) => {
    const { path } = useRouteMatch()

    return (
        <div className="auth">
                <Route path={`${path}/login`}>
                    <Login onLogIn={AuthFunctions.AuthLogIn} />
                </Route>
                <Route path={`${path}/signup`}>
                    <SignUp onSignUp={AuthFunctions.AuthSignUp} />
                </Route>
                <Route path={`${path}/logout`}>
                    <LogOut />
                </Route>
        </div>
    )
}

export default Auth
