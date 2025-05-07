'use client'
import { useEffect } from "react";

const Modal = ({
    isOpen,
    onClose,
    children,
    modalClass,
    bgStyle
}) => {

    useEffect(() => {
        if (isOpen) {
            // Disable scrolling when modal is open
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none'; // For mobile devices
        } else {
            // Re-enable scrolling when modal is closed
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }

        // Cleanup function to re-enable scrolling when component unmounts
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isOpen]);
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex p-4 px-6  items-center  justify-center z-50">
            <div
                className={`fixed top-0 left-0 w-full h-full bg-black/40 ${bgStyle}`}
                onClick={onClose}
            ></div>
            <div
                className={`fixed xl:w-[35%] md:w-[48%] sm:w-[80%] w-[90%] max-h-[96%] custom-scrollbar flex flex-col gap-4 overflow-auto justify-between bg-white px-4 py-3 rounded-lg  shadow-lg ${modalClass}`}
            >

                <div className="w-full">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
