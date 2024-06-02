import { toast,Bounce } from "react-toastify";

const SuccessNotification = (message) => {
    toast.success(message, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
        });
    };

const ErrorNotification = (message) => {
    toast.error(message, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
        });
    }
const WarningNotification = (message) => {
    toast.warn(message, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
        });
    }



export {SuccessNotification,ErrorNotification,WarningNotification};