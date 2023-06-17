import React from "react";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Layout from './layout/Layout';
import axios from "axios";
import Chat from "./pages/Chat";

const App = () => {
    axios.defaults.baseURL = "https://api-chat-ws.onrender.com/api/v1";
    axios.defaults.withCredentials = true;

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/chat" element={<Chat />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
