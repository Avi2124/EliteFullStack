import { createRoot } from 'react-dom/client'
import "./styles/style.scss";
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
)
