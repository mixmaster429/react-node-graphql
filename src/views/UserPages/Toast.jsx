import { toast } from "react-toastify";

toast.configure({
    draggable: true,
    position:"bottom-center",
    autoClose:5000,
    hideProgressBar:false,
    newestOnTop:false,    
});

export const success = Msg => {
    toast.success(Msg);
}

export const error = Msg => {
    toast.error(Msg);
}