import React, { useState } from "react";
import "./login.css";

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => setIsActive(true);
  const handleLoginClick = () => setIsActive(false);

  return (
    <div
      className={`login-page ${isActive ? "login-page--active" : ""}`}
      id="login-page"
    >
      <div className="login-page__form-container login-page__form-container--sign-up">
        <form className="login-page__form login-page__form--create-account">
          <h1 className="login-page__title">Create Account</h1>
          <div className="login-page__social-icons">
            <a href="#" className="login-page__icon">
              <i className="fa-brands fa-google-plus-g"></i>
            </a>
            <a href="#" className="login-page__icon">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className="login-page__icon">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="login-page__icon">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
          <span className="login-page__description">
            or use your email for registration
          </span>
          <input type="text" className="login-page__input" placeholder="Name" />
          <input
            type="email"
            className="login-page__input"
            placeholder="Email"
          />
          <input
            type="password"
            className="login-page__input"
            placeholder="Password"
          />
          <button className="login-page__button">Sign Up</button>
        </form>
      </div>

      <div className="login-page__form-container login-page__form-container--sign-in">
        <form className="login-page__form">
          <h1 className="login-page__title">Sign In</h1>
          <div className="login-page__social-icons">
            <a href="#" className="login-page__icon">
              <i className="fa-brands fa-google-plus-g"></i>
            </a>
            <a href="#" className="login-page__icon">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className="login-page__icon">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="login-page__icon">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
          <span className="login-page__description">
            or use your email and password
          </span>
          <input
            type="email"
            className="login-page__input"
            placeholder="Email"
          />
          <input
            type="password"
            className="login-page__input"
            placeholder="Password"
          />
          <a href="#" className="login-page__forgot-password">
            Forgot Your Password?
          </a>
          <button className="login-page__button">Sign In</button>
        </form>
      </div>

      <div className="login-page__toggle-container">
        <div className="login-page__toggle">
          <div className="login-page__panel login-page__panel--left">
            <h1 className="login-page__panel-title">Welcome Back!</h1>
            <p className="login-page__panel-description">
              Enter your personal details to use all of the site features
            </p>
            <button
              className="login-page__panel-button"
              onClick={handleLoginClick}
            >
              Sign In
            </button>
          </div>
          <div className="login-page__panel login-page__panel--right">
            <h1 className="login-page__panel-title">Hello, Friend!</h1>
            <p className="login-page__panel-description">
              Register with your personal details to use all of the site
              features
            </p>
            <button
              className="login-page__panel-button"
              onClick={handleRegisterClick}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
