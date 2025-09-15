import type React from "react";

interface ErrorAlertInterface {
    msg: string,
    closeError: () => void,
}

const ErrorAlert: React.FC<ErrorAlertInterface> = ({msg, closeError}) => {
  
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md flex justify-between items-center">
        <div>
        <p className="font-bold">Invalid JSON</p>
        <p>{msg}</p>
        </div>
        <button
            onClick={closeError}
            className="text-red-700 hover:text-red-900 font-bold cursor-pointer"
            aria-label="Close alert"
        >✕</button>
    </div>
  );
};

export default ErrorAlert;