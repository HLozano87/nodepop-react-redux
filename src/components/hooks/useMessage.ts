import { useState } from "react";

export function useMessages(timeOut = 2000) {
  const [successMessage, setSuccessMsg] = useState("");
  const [errorMessage, setErrorMsg] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), timeOut);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), timeOut);
  };

  return {
    successMessage,
    errorMessage,
    showSuccess,
    showError,
  };
}
