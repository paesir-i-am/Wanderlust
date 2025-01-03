import React from "react";

const getFullImageUrl = (imageUrl) => {
  const BASE_URL = "http://localhost:8080";
  return imageUrl
    ? `${BASE_URL}${imageUrl}`
    : `${BASE_URL}/backend/uploads/default-profile.gif`;
};

const FollowListModal = ({ type, list = [], onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
        <h2>{type === "followers" ? "Followers" : "Following"}</h2>
        {list.length > 0 ? (
          <ul>
            {list.map((profile) => (
              <li key={profile.nickname}>
                <img
                  src={getFullImageUrl(profile.profileImageUrl)}
                  alt={`${profile.nickname}'s profile`}
                  className="profile-image"
                />
                <span>{profile.nickname}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No {type} available.</p>
        )}
      </div>
    </div>
  );
};

export default FollowListModal;
