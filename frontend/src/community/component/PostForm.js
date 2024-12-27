import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createPost } from "../api/postApi";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  // Redux에서 로그인된 사용자 정보 가져오기
  const nickname = useSelector((state) => state.loginSlice.nickname);

  if (!nickname) {
    return <p>닉네임을 불러올 수 없습니다</p>;
  }

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nickname) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const postData = {
        content,
        authorNickname: nickname, // 로그인된 사용자의 닉네임으로 처리
      };

      await createPost(postData, image);

      alert("게시글이 성공적으로 업로드되었습니다.");
      window.location.reload();
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("게시글 업로드 실패:", error);
      alert("게시글 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>작성자 : {nickname}</div>
      <div>
        <textarea
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={handleContentChange}
          required
        />
      </div>
      <div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button type="submit">게시글 업로드</button>
    </form>
  );
};

export default PostForm;
