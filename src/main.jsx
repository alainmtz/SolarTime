import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/main-cd.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientesPage from './pages/ClientesPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/clientes" element={<ClientesPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
