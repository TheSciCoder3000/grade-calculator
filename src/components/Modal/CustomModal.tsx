import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import "./Modal.css";

// ============================== Types ==============================
type TModalContext = TModalObject | null;
interface TModalObject {
    target: string;
    data?: any;
}
interface IControllerContext {
    controller: TModalContext;
    setController: React.Dispatch<React.SetStateAction<TModalContext>>;
    allowOutsideClick: boolean;
    setAllowOutsideClick: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IMSwitchProps {
    type: string;
}
interface IModalProps {
    className?: string;
}

// ============================== Module Logic ==============================
// TODO: USE REACT PORTALS

/**
 * Used to provide the react app the ability to retrieve and set the modal state and the attached payload
 */
const ModalControllerContext = createContext<IControllerContext>({} as IControllerContext);

/**
 * Modal Controller container that wraps around your react app to give the application access to the modal state and update it
 * @returns jsx component
 */
export const ModalController: React.FC = ({ children }) => {
    const [controller, setController] = useState<TModalContext>(null);
    const [allowOutsideClick, setAllowOutsideClick] = useState(true);
    return (
        <ModalControllerContext.Provider
            value={{ controller, setController, allowOutsideClick, setAllowOutsideClick }}
        >
            {children}
        </ModalControllerContext.Provider>
    );
};

/**
 * context function to get the update controller method
 * @returns a function to update the modal state
 */
export const useController = () => useContext(ModalControllerContext).setController;
/**
 * context function to get the attached payload of the current modal state
 * @returns data/payload attached to the modal state
 */
export const useControllerData = () => useContext(ModalControllerContext).controller?.data;
/**
 * context function to get the update allow outside click method
 * @returns a function to allow or disable outside click
 */
export const useAllowOutsideClick = () => useContext(ModalControllerContext).setAllowOutsideClick;

/**
 * Used to provide the modal children the modal state and the optional payload/data
 */
const ModalContext = createContext<TModalContext>(null);

/**
 * a modal container to provide the modal children context values
 * @param {IModalProps} ModalProps
 * @returns a jsx component
 */
export const Modal: React.FC<IModalProps> = ({ className, children }) => {
    // get the app's current modal state and update state method
    const { controller, setController, allowOutsideClick } = useContext(ModalControllerContext);
    // get the model view container node ref to close the modal when user clicks outside the modal
    const modalViewRef = useRef<HTMLDivElement>(null);

    // initialize an event listener to check if a click is within or outside the modal
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                modalViewRef.current &&
                controller &&
                !modalViewRef.current.contains(e.target as Node | null) &&
                allowOutsideClick
            )
                setController(null);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [modalViewRef, controller, allowOutsideClick]);

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

/**
 * It contains the modal that is going to be displayed when its type matches with the modal state
 * @param {IMSwitchProps} MSwitchProps object containing the container's `type` property
 */
export const MSwitch: React.FC<IMSwitchProps> = ({ type, children }) => {
    const ModalType = useContext(ModalContext);

    return type === ModalType?.target ? <>{children}</> : <></>;
};
