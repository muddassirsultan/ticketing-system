export default function Button({ children, type = 'button', onClick, disabled = false, fullWidth = false }) {
    const baseClasses = "px-4 py-2 font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";
    const colorClasses = disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${colorClasses} ${widthClass} transition-colors duration-200`}
        >
            {children}
        </button>
    );
}