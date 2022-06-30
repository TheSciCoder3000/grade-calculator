import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import "./Modal.css";

type TModalContext = TModalObject | null;
interface TModalObject {
    target: string;
    data?: any;
}
const ModalContext = createContext<TModalContext>(null);

const ModalControllerContext = createContext<IControllerContext>({} as IControllerContext);
export const ModalController: React.FC = ({ children }) => {
    const [controller, setController] = useState<TModalContext>(null);
    return (
        <ModalControllerContext.Provider value={{ controller, setController }}>
            {children}
        </ModalControllerContext.Provider>
    );
};

export const useController = () => useContext(ModalControllerContext).setController;
export const useControllerData = () => useContext(ModalControllerContext).controller?.data;

interface IModalProps {
    className?: string;
}
export const Modal: React.FC<IModalProps> = ({ className, children }) => {
    const { controller, setController } = useContext(ModalControllerContext);
    const modalViewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (modalViewRef.current && controller && !modalViewRef.current.contains(e.target as Node | null))
                setController(null);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [modalViewRef, controller]);
    return (
        <ModalContext.Provider value={controller}>
            <div style={{ display: !controller ? "none" : "block" }} className={`modal-cont ${className}`}>
                <div ref={modalViewRef} className="modal-view">
                    {children}
                </div>
            </div>
        </ModalContext.Provider>
    );
};

interface IMSwitchProps {
    type: string;
}
export const MSwitch: React.FC<IMSwitchProps> = ({ type, children }) => {
    const ModalType = useContext(ModalContext);

    return type === ModalType?.target ? <>{children}</> : <></>;
};

interface IControllerContext {
    controller: TModalContext;
    setController: React.Dispatch<React.SetStateAction<TModalContext>>;
}
