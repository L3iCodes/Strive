import { X } from "lucide-react";

interface ModalProps{
    children?: React.ReactNode;
    isModalOpen?: boolean;
    onClose?: () => void;
}

const Modal = ({children, isModalOpen, onClose}: ModalProps) => {
    if(!isModalOpen) return;

    return (
        <div onClick={onClose} className="w-full h-full p-10 pt-[60px] flex items-center justify-center md:pl-[60px] md:pt-0 bg-base-300/70 backdrop-blur-xs absolute top-0 left-0 z-100">
            <div onClick={(e) => e.stopPropagation()} className="w-3xl max-w-3xl flex flex-col bg-base-100 border-2 border-base-content/10 rounded-md p-5 relative">
                <X onClick={onClose} size={20} className="absolute top-2 right-2 transition-all ease-in duration-300 hover:scale-120 cursor-pointer" />
                {children}
            </div>
        </div>
    )
}

export default Modal
