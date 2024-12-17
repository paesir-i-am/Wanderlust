import React, { useState } from "react";
import LoginModal from "../../component/LoginModal";

const LoginPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="page-container">
      <button onClick={() => setShowModal(true)} className="login-btn">
        로그인
      </button>
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default LoginPage;
