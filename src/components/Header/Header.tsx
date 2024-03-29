import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthStatusType, SignOutType } from "@useFirebase";
import AccountIcon from "./account_circle.svg";
import "./css/Header.css";
// import "dotenv/config";

interface HeaderProps {
    IsSignedIn: AuthStatusType;
    onSignOut: SignOutType;
}

/**
 * App header component
 * @param {HeaderProps} HeaderProps - { IsSignedIn, onSignOut }
 * @returns JSX Header Component
 */
const Header: React.FC<HeaderProps> = ({ IsSignedIn, onSignOut }) => {
    // Header states
    const history = useHistory();
    const [toggleProfileMenu, setToggleProfileMenu] = useState(false);

    // handle clicks outside the profile menu container
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

    const demoMode = process.env.REACT_APP_DEMO_MODE === "DEMO";

    return (
        <div className="header">
            <div className="header-cont">
                <div className="header-logo">Grade Calculator{demoMode ? ": DEMO MODE" : ""}</div>
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
                                        <div
                                            className="sign-out-menu menu-item"
                                            onClick={demoMode ? () => {} : onSignOut}
                                        >
                                            Sign Out
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : !demoMode ? (
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
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
