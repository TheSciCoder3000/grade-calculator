import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { FirebaseAuthType } from '../../Firebase'
import Login from './AuthActions/Login'
import LogOut from './AuthActions/LogOut'
import SignUp from './AuthActions/SignUp'

interface AuthProps {
    AuthFunctions: FirebaseAuthType['AuthFunctions']
}

const Auth: React.FC<AuthProps> = ({ AuthFunctions }) => {
    const { path } = useRouteMatch()

    return (
        <div className="auth">
            auth page
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
