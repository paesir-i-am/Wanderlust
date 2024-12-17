import React from "react";
import "./core.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./member/pages/login/LoginPage";
import MainPage from "./main/pages/MainPage";
import BasicLayout from "./common/layout/basicLayout/BasicLayout";

const App = () => {
  return (
    <Router>
      <BasicLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/member" element={<LoginPage />} />
        </Routes>
      </BasicLayout>
    </Router>
  );
};

export default App;
