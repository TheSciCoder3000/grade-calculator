import React, { createContext, useContext, useState } from 'react'

type TModalContext = string
const ModalContext = createContext<TModalContext>('')

interface IModalProps {
    typeSwitch: string
    className?: string
}

const Modal: React.FC<IModalProps> = ({ typeSwitch, className, children }) => {
    return (
        <ModalContext.Provider value={typeSwitch}>
            <div className={`modal-cont ${className}`}>
                {children}
            </div>
        </ModalContext.Provider>
    )
}

interface IMSwitchProps { type: string }
export const MSwitch: React.FC<IMSwitchProps> = ({ type, children }) => {
    const ModalType = useContext(ModalContext)

    return type === ModalType ? (
        <>{children}</>
    ) : <></>
}

export default Modal