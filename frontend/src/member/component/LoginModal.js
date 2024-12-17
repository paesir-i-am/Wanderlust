import React, { useState } from "react";

const LoginModal = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const togglePanel = () => setIsSignUp((prev) => !prev);

  return (
    <div className="modal-overlay">
      <div className={`container ${isSignUp ? "active" : ""}`}>
        {/* Sign Up */}
        <div className="form-container sign-up">
          <form>
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In */}
        <div className="form-container sign-in">
          <form>
            <h1>Sign In</h1>
            <span>or use your email password</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Forget Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Toggle Panel */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" onClick={togglePanel}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>
                Register with your personal details to use all of site features
              </p>
              <button className="hidden" onClick={togglePanel}>
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
