import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from './components/Header/Header';
import Home from "./components/Home/Home";
import AuthPage from "./pages/AuthPage/AuthPage";
import AnswerPage from "./pages/AnswerPage/AnswerPage";
import AskPage from "./pages/AskPage/Ask";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import GetStarted from "./pages/GetStarted/GetStarted";
import { AuthProvider } from './Context/authContext';

const AppLayout = () => {
  const location = useLocation();
  const isGetStartedPage = location.pathname === '/';

  return (
    <>
      {!isGetStartedPage && <Header />}
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/auth" element={<AuthPage showLogin={false} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<AuthPage showLogin={true} />} />
        <Route path="/answers" element={<AnswerPage />} />
        <Route path="/questions" element={<AskPage />} />
        <Route path="/questions/:id" element={<AnswerPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
      {!isGetStartedPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
