import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from './components/Header/Header';
import Home from "./components/Home/Home";
import AuthPage from "./pages/AuthPage/AuthPage";
import AnswerPage from "./pages/AnswerPage/AnswerPage";
import AskPage from "./pages/AskPage/Ask";
import { AuthProvider } from './Context/authContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<AuthPage showLogin={false} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<AuthPage showLogin={true} />} />
          <Route path="/answers" element={<AnswerPage />} />
          <Route path="/questions" element={<AskPage />} />
          <Route path="/questions/:id" element={<AnswerPage />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
