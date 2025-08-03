import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import ActualitesPage from "./pages/ActualitesPage";
import CompetencesPage from "./pages/CompetencesPage";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/actualites" element={<ActualitesPage />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/competences" element={<CompetencesPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;