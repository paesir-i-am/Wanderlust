import axiosInstance from "../../common/api/mainApi";

// 게시글 목록 가져오기
export const fetchPosts = async (page) => {
  try {
    const response = await axiosInstance.get(
      `/community/posts?page=${page}&size=5`,
    );
    return response.data; // 데이터 전체 반환
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { content: [], last: true }; // 기본값 설정
  }
};

// 게시글 생성
export const createPost = (postData, image) => {
  const formData = new FormData();
  formData.append("content", postData.content);
  formData.append("authorNickname", postData.authorNickname);
  if (image) {
    formData.append("image", image);
  }

  return axiosInstance.post("/community/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 게시글 수정
export const updatePost = (id, postData, image) => {
  const formData = new FormData();
  formData.append("content", postData.content);
  if (image) {
    formData.append("image", image);
  }

  return axiosInstance.put(`/community/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 게시글 삭제
export const deletePost = (id) =>
  axiosInstance.delete(`/community/posts/${id}`);
