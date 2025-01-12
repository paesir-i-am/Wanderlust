import React, { useState } from "react";
import ModelLoader from "./ModelLoader";

const ImageSearchButton = () => {
  const [showImageSearchModal, setShowImageSearchModal] = useState(false);

  const handleOpenModal = () => {
    setShowImageSearchModal(true);
  };

  const handleCloseModal = () => {
    setShowImageSearchModal(false);
  };

  return (
    <>
      <button onClick={handleOpenModal}>
        <img src="/icons/picturSearchIcon.svg" alt="PictureSearch" />
      </button>

      {showImageSearchModal && <ModelLoader onClose={handleCloseModal} />}
    </>
  );
};

export default ImageSearchButton;
