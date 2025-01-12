import { useState, useEffect, useRef } from "react";
import { fetchFollowerCount, fetchFollowingCount } from "../../api/followApi";
import { useSelector } from "react-redux";
import FollowButton from "../FollowButton";
import "../scss/profile/ProfileInfo.scss";

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

  const fileInputRef = useRef(null); // 파일 입력 요소 참조 생성

  const handleImageClick = () => {
    // isEditing 상태일 때만 파일 선택 창 열기
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

  return (
    <div className="profile-info">
      <div className="profile-left">
        <img
          src={getFullImageUrl(profile.profileImageUrl)}
          alt={`${profile.nickname}'s profile`}
          className={`profile-image ${isEditing ? "editable" : ""}`}
          onClick={handleImageClick} // 이미지 클릭 이벤트 추가
        />
        <input
          type="file"
          ref={fileInputRef} // 참조 연결
          onChange={(e) => {
            handleImageChange(e); // 기존 핸들러 유지
          }}
          style={{ display: "none" }} // 파일 선택 요소 숨기기
        />
      </div>
      <div className="profile-right">
        <div className="profile-top">
          <h1 className="nickname">{profile.nickname}</h1>
          {!isOwner && <FollowButton targetNickname={profile.nickname} />}
          {isOwner && !isEditing && (
            <div className="actions">
              <button
                onClick={() => {
                  setIsEditing(true);
                  onEditStart();
                }}
                className="edit-btn"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        <div className="follow-info">
          <span onClick={onShowFollowers} className="follow-count">
            Followers: {followerCount}
          </span>
          <span onClick={onShowFollowing} className="follow-count">
            Following: {followingCount}
          </span>
        </div>
        <div className="profile-bio">
          {isEditing ? (
            <>
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="Update your bio"
                className="editable-bio"
              />
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </>
          ) : (
            <p>{bio ? bio : "자기소개를 입력해주세요"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
