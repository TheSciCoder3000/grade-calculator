import React from 'react'
import { useHistory } from 'react-router-dom'
import { FirebaseAuthType } from '../../Firebase'

interface HeaderProps {
    IsSignedIn: FirebaseAuthType['AuthStatus']
    onSignOut: FirebaseAuthType['AuthFunctions']['AuthSignOut']
}

const Header: React.FC<HeaderProps> = ({ IsSignedIn, onSignOut }) => {
    const history = useHistory()
    return (
        <div className="header">
            <div className="header-cont">
                <div className="header-logo">Grade Calculator</div>
                <div className="header-menu">
                    {IsSignedIn ?
                        <>
                            <div className="header-avatar" onClick={onSignOut}>LogOut</div>
                        </>
                        :
                        <ul>
                            <li className="menu-items" onClick={() => { history.push('/auth/login') }}>Log In</li>
                            <li className="menu-items" onClick={() => { history.push('/auth/signup') }}>Sign Up</li>
                        </ul>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header
