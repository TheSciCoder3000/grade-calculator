import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FirebaseType } from '@useFirebase'

import AccountIcon from './account_circle.svg'
import './css/Header.css'

interface HeaderProps {
    IsSignedIn: FirebaseType['Auth']['AuthStatus']
    onSignOut: FirebaseType['Auth']['AuthFunctions']['AuthSignOut']
}

const Header: React.FC<HeaderProps> = ({ IsSignedIn, onSignOut }) => {
    const history = useHistory()
    const [toggleProfileMenu, setToggleProfileMenu] = useState(false)

    return (
        <div className="header">
            <div className="header-cont">
                <div className="header-logo">Grade Calculator</div>
                <div className="header-menu">
                    {IsSignedIn ?
                        <>
                            <div className="header-avatar" onClick={() => setToggleProfileMenu(state => !state)}>
                                <img src={AccountIcon} alt="" className="avatar-icon" />
                                {toggleProfileMenu &&
                                    <div className="profile-menu">
                                        <div className="sign-out-menu menu-item" onClick={onSignOut}>Sign Out</div>
                                    </div>
                                }
                            </div>
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
