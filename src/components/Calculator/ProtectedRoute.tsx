import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

interface IProtectedRouteProps extends RouteProps {
    isAuth: boolean
}
const ProtectedRoute: React.FC<IProtectedRouteProps> = ({ isAuth, ...RouteProps }) => {
    if (isAuth) {
        return <Route {...RouteProps} />
    }
    return <Redirect to='/auth/login' />
}

export default ProtectedRoute
