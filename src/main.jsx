import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppProvider";
import { ToastContainer } from "react-toastify";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <ToastContainer className="mt-20" />
            <App />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);

// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App";

// createRoot(document.getElementById("root")).render(<App />);
