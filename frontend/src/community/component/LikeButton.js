import React, { useState, useEffect } from "react";
import { toggleLike, fetchLikesCount } from "../api/postApi";

const LikeButton = ({ id, token }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // 좋아요 수와 초기 상태 가져오기
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const count = await fetchLikesCount(id);
        setLikeCount(count);
        // 초기 좋아요 상태 설정 (기본값: false)
        setIsLiked(false); // 서버에서 실제 상태를 받아오도록 수정 가능
      } catch (error) {
        console.error(`Failed to fetch likes for post ${id}:`, error);
      }
    };

    fetchLikes();
  }, [id]);

  // 좋아요 토글 핸들러
  const handleToggleLike = async () => {
    try {
      await toggleLike(id, token);
      setIsLiked(!isLiked); // 좋아요 상태 토글
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1)); // 좋아요 개수 업데이트
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <button
        onClick={handleToggleLike}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          fontSize: "24px",
          color: isLiked ? "red" : "gray",
          transition: "color 0.3s",
        }}
      >
        {isLiked ? "❤️" : "♡"}
      </button>
      <span>{likeCount}명이 좋아합니다</span>
    </div>
  );
};

export default LikeButton;
