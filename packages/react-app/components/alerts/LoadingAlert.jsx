
  const LoadingAlert = ({ message }) => {
    return (
        <div
            className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3"
            role="alert"
        >
            <p className="font-bold">{message || "Loading..."}</p>
            <p className="text-sm">Interacting with smart contract.</p>
        </div>
    );
  };
  
  export default LoadingAlert;