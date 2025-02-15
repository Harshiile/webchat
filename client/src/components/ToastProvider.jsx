import { Toaster } from "sonner";

const ToastProvider = () => {
    return (
        <Toaster
            richColors
            style={{
                fontSize: "2rem", // Set font size
                fontFamily: "'Poppins', sans-serif" // Use Poppins font (or any other)
            }}
            position="bottom-right"
            duration={4000} // Default duration for toasts
            closeButton
            expand={true} // Expands toast if there is a description
            visibleToasts={3} // Show max 3 toasts at a time
        />
    );
};

export default ToastProvider;
