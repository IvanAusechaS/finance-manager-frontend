import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Benefits } from "./components/Benefits";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import React from "react";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="benefits">
        <Benefits />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <CTA />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Toaster />
    </>
  );
}
