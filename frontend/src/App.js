import React from "react";
import "./core.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import MainPage from "./pages/main/MainPage";
import BasicLayout from "./Layout/basicLayout/BasicLayout";

const App = () => {
  return (
    <Router>
      <BasicLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BasicLayout>
    </Router>
  );
};

export default App;
