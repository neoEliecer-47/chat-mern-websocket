import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import UserProvider from './context/UserContext.jsx';
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
        <BrowserRouter>
            <UserProvider>
                    <App />
            </UserProvider>
        </BrowserRouter>
);
