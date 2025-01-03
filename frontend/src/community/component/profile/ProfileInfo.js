import { useState, useEffect } from "react";
import { fetchFollowerCount, fetchFollowingCount } from "../../api/followApi";
import { useSelector } from "react-redux";
import FollowButton from "../FollowButton";

const getFullImageUrl = (imageUrl) => {
  const BASE_URL = "http://localhost:8080";
  return imageUrl
    ? `${BASE_URL}${imageUrl}`
    : `${BASE_URL}/backend/uploads/default-profile.gif`;
};

const ProfileInfo = ({
  profile,
  onEditStart,
  onEditCancel,
  onProfileUpdate,
  onShowFollowers,
  onShowFollowing,
}) => {
  const [bio, setBio] = useState(profile.bio || "");
  const [editedBio, setEditedBio] = useState(bio);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

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

  const handleSave = () => {
    const formData = new FormData();
    formData.append("bio", editedBio || "");

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    onProfileUpdate(profile.nickname, formData); // 부모 컴포넌트로 전달
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBio(bio); // 원래 bio로 복구
    setProfileImage(null); // 이미지 초기화
    onEditCancel();
    setIsEditing(false);
  };

  return (
    <div className="profile-info">
      <img
        src={getFullImageUrl(profile.profileImageUrl)}
        alt={`${profile.nickname}'s profile`}
        className="profile-image"
        style={{ width: `50px`, height: `50px`, borderRadius: `50px` }}
      />
      <h1>
        {profile.nickname}
        {!isOwner && <FollowButton targetNickname={profile.nickname} />}
      </h1>

      {/* bio 표시 */}
      {isEditing ? (
        <>
          <textarea
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            placeholder="Update your bio"
            className="profile-bio"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="profile-image-input"
          />
          <button onClick={handleSave} className="profile-save-btn">
            Save
          </button>
          <button onClick={handleCancel} className="profile-cancel-btn">
            Cancel
          </button>
        </>
      ) : (
        <p className="profile-bio">{bio ? bio : "자기소개를 입력해주세요"}</p>
      )}

      {/* 수정 버튼 */}
      {isOwner && !isEditing && (
        <button
          onClick={() => {
            setIsEditing(true);
            onEditStart();
          }}
          className="profile-edit-btn"
        >
          Edit Profile
        </button>
      )}

      <div className="follow-info">
        <span onClick={onShowFollowers} className="follow-count">
          Followers: {followerCount}
        </span>
        <span onClick={onShowFollowing} className="follow-count">
          Following: {followingCount}
        </span>
      </div>
    </div>
  );
};

export default ProfileInfo;
