import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { createPost } from "../../api/postApi";
import "../scss/post/PostForm.css";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null); // 파일 입력 참조

  const nickname = useSelector((state) => state.loginSlice.nickname);

  if (!nickname) {
    return <p>포스트 작성을 하기 위해선 로그인이 필요합니다</p>;
  }

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 파일 업로더 실행
    }
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
        authorNickname: nickname,
      };

      await createPost(postData, image);

      alert("게시글이 성공적으로 업로드되었습니다.");
      window.location.reload();
      setContent("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("게시글 업로드 실패:", error);
      alert("게시글 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="post-form__nickname">작성자 : {nickname}</div>
      <div className="post-form__container">
        <textarea
          placeholder="내용을 입력해주세요"
          value={content}
          onChange={handleContentChange}
          required
          className="post-form__textarea"
        />
        <div className="post-form__image-upload" onClick={handleImageClick}>
          {preview ? (
            <img
              src={preview}
              alt="미리보기"
              className="post-form__image-preview"
            />
          ) : (
            <span className="post-form__placeholder">
              이미지를 업로드하려면 클릭하세요
            </span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef} // 숨겨진 파일 입력 필드 참조
          onChange={handleImageChange}
          style={{ display: "none" }} // 파일 입력 숨기기
        />
      </div>
      <button type="submit" className="post-form__submit">
        게시글 업로드
      </button>
    </form>
  );
};

export default PostForm;
