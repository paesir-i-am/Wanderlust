import axiosInstance from "../../common/api/mainApi";

// 게시글 목록 가져오기
export const fetchPosts = async (page = 0, size = 10) => {
  try {
    // Axios 인스턴스 사용하여 API 호출
    const response = await axiosInstance.get("/community/posts", {
      params: { page, size },
    });
    // 응답 데이터 반환
    return response.data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { content: [], last: true }; // 기본값 반환
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
export const updatePost = async (id, postData, image) => {
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
export const deletePost = async (id) => {
  return axiosInstance.delete(`/community/posts/${id}`);
};

// 좋아요 토글
export const toggleLike = async (id, token) => {
  return axiosInstance.post(
    `/community/posts/${id}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// 좋아요 개수 가져오기
export const fetchLikesCount = async (id) => {
  try {
    const response = await axiosInstance.get(`/community/posts/${id}/likes`);
    return response.data.count;
  } catch (error) {
    console.error(`Failed to fetch likes count for post ${id}:`, error);
    return 0; // 오류 시 기본값 반환
  }
};
