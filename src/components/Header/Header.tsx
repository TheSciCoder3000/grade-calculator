import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthStatusType, SignOutType } from "@useFirebase";

import AccountIcon from "./account_circle.svg";
import "./css/Header.css";

interface HeaderProps {
    IsSignedIn: AuthStatusType;
    onSignOut: SignOutType;
}

const Header: React.FC<HeaderProps> = ({ IsSignedIn, onSignOut }) => {
    const history = useHistory();
    const [toggleProfileMenu, setToggleProfileMenu] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const targetEl = e.target as HTMLElement;
            if (
                menuRef.current &&
                !menuRef.current.contains(targetEl) &&
                menuRef.current !== targetEl &&
                targetEl !== imgRef.current
            ) {
                setToggleProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [menuRef]);
    return (
        <div className="header">
            <div className="header-cont">
                <div className="header-logo">Grade Calculator</div>
                <div className="header-menu">
                    {IsSignedIn ? (
                        <>
                            <div className="header-avatar">
                                <img
                                    ref={imgRef}
                                    src={AccountIcon}
                                    alt=""
                                    className="avatar-icon"
                                    onClick={() => setToggleProfileMenu((state) => !state)}
                                />
                                {toggleProfileMenu && (
                                    <div ref={menuRef} className="profile-menu">
                                        <div className="sign-out-menu menu-item" onClick={onSignOut}>
                                            Sign Out
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <ul>
                            <li
                                className="menu-items"
                                onClick={() => {
                                    history.push("/auth/login");
                                }}
                            >
                                Log In
                            </li>
                            <li
                                className="menu-items"
                                onClick={() => {
                                    history.push("/auth/signup");
                                }}
                            >
                                Sign Up
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
