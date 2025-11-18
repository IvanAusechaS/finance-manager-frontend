import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import LandingPage from "../pages/LandingPage";


const RoutesPages = () => {
  console.log("🔀 [RoutesPages] Router inicializado");

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesPages;
