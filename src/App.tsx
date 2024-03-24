import MagicProvider from "./components/MagicProvider";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MagicDashboardRedirect from "./components/MagicDashboardRedirect";

export default function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token") ?? "");
  }, [setToken]);

  return (
    <MagicProvider>
      <ToastContainer />
      {process.env.REACT_APP_MAGIC_LINK_KEY ? (
        token.length > 0 ? (
          <Dashboard token={token} setToken={setToken} />
        ) : (
          <Login token={token} setToken={setToken} />
        )
      ) : (
        <MagicDashboardRedirect />
      )}
    </MagicProvider>
  );
}
