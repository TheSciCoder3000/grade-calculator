import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { IFirebaseContext } from 'Firebase'
import Login from '@Components/Auth/Login'
import LogOut from '@Components/Auth/LogOut'
import SignUp from '@Components/Auth/SignUp'

import './css/Auth.css'

interface AuthProps {
    AuthFunctions: IFirebaseContext['Auth']['AuthFunctions']
}

const Auth: React.FC<AuthProps> = ({ AuthFunctions }) => {
    const { path } = useRouteMatch()

    return (
        <div className="auth">
            <Route exact path={`${path}/`}>
                <div className="not-exist">
                    <h1>This Directory does not exist</h1>
                    <p>Please go back to the previous route</p>
                </div>
            </Route>
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
