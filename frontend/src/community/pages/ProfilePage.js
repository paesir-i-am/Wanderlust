import React, { useState, useEffect } from "react";
import ProfileInfo from "../component/ProfileInfo";
import ProfilePostSection from "../component/ProfilePostSection";
import { fetchProfile } from "../api/profileApi";
import { fetchPostsByNickname } from "../api/postApi";
import "./scss/ProfilePage.css";
import { useParams } from "react-router-dom";

const ProfilePage = ({ match }) => {
  const [profile, setProfile] = useState(null);
  const [post, setPost] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { nickname } = useParams();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile(nickname);
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    const loadPosts = async () => {
      try {
        const data = await fetchPostsByNickname(nickname, page);
        setPost((prevPost) => [...prevPost, ...data.content]);
        setHasMore(!data.last);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    loadProfile();
    loadPosts();
  }, [nickname, page]);

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <ProfileInfo profile={profile} onProfileUpdate={handleProfileUpdate} />
      <ProfilePostSection
        post={post}
        onPostClick={(post) => console.log("Post clicked:", post)}
      />
      {hasMore && (
        <button onClick={handleLoadMore} className="load-more-btn">
          Load More
        </button>
      )}
    </div>
  );
};

export default ProfilePage;
