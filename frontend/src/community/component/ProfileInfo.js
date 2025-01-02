import { useState, useEffect } from "react";
import {
  fetchFollowerCount,
  fetchFollowingCount,
  fetchFollowers,
  fetchFollowing,
} from "../api/followApi";
import { updateProfile } from "../api/profileApi";
import { useSelector } from "react-redux";
import FollowButton from "./FollowButton";

const getFullImageUrl = (imageUrl) => {
  const BASE_URL = "http://localhost:8080";
  return imageUrl
    ? `${BASE_URL}${imageUrl}`
    : `${BASE_URL}/backend/uploads/default-profile.gif`;
};

const ProfileInfo = ({ profile, onProfileUpdate }) => {
  const [bio, setBio] = useState(profile.bio || "");
  const [profileImage, setProfileImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [modalTitle, setModalTitle] = useState("");
  const [modalList, setModalList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentNickname = useSelector((state) => state.loginSlice.nickname);
  const isOwner = currentNickname === profile.nickname;

  useEffect(() => {
    const loadFollowCounts = async () => {
      try {
        const followers = await fetchFollowerCount(profile.nickname);
        const following = await fetchFollowingCount(profile.nickname);
        setFollowerCount(followers);
        setFollowingCount(following);
      } catch (error) {
        console.error("Error loading follow counts:", error);
      }
    };

    loadFollowCounts();
  }, [profile.nickname]);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const updatedProfile = { bio };
      const updatedData = await updateProfile(
        profile.nickname,
        updatedProfile,
        profileImage,
      );
      onProfileUpdate(updatedData);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleShowFollowers = async () => {
    try {
      const followers = await fetchFollowers(profile.nickname);
      setModalTitle("Followers");
      setModalList(followers.content);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading followers:", error);
    }
  };

  const handleShowFollowing = async () => {
    try {
      const following = await fetchFollowing(profile.nickname);
      setModalTitle("Following");
      setModalList(following.content);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading following:", error);
    }
  };

  return (
    <div className="profile-info">
      <img
        src={getFullImageUrl(profile.profileImage)}
        alt={`${profile.nickname}'s profile`}
        className="profile-image"
        style={{ width: `50px`, height: `50px`, borderRadius: `50px` }}
      />
      <h1>
        {profile.nickname}
        {!isOwner && (
          <FollowButton
            targetNickname={profile.nickname}
            onFollow={handleReload}
            onUnfollow={handleReload}
          />
        )}
      </h1>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Update your bio"
        className="profile-bio"
      ></textarea>
      <input
        type="file"
        onChange={handleImageChange}
        className="profile-image-input"
      />
      <button
        onClick={handleUpdate}
        className="profile-update-btn"
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : "Update Profile"}
      </button>
      <div className="follow-info">
        <span onClick={handleShowFollowers} className="follow-count">
          Followers: {followerCount}
        </span>
        <span onClick={handleShowFollowing} className="follow-count">
          Following: {followingCount}
        </span>
      </div>
      {isModalOpen && (
        <div className="modal">
          <h2>{modalTitle}</h2>
          <ul>
            {modalList.map((user) => (
              <li key={user.nickname}>
                <img
                  src={getFullImageUrl(user.profileImage)}
                  alt={user.nickname}
                  style={{
                    width: `40px`,
                    height: `40px`,
                    borderRadius: `20px`,
                  }}
                />
                <span>{user.nickname}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
