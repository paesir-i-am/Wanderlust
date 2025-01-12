import axiosInstance from "../../common/api/mainApi";

// 댓글 목록 조회
export const fetchComments = async (postId) => {
  try {
    const response = await axiosInstance.get("/community/comments", {
      params: { postId },
    });
    return response.data.content; // 페이징된 content만 반환
  } catch (error) {
    console.error(`Failed to fetch comments for post ${postId}:`, error);
    return [];
  }
};

// 댓글 생성
export const createComment = async (postId, content, token) => {
  try {
    const response = await axiosInstance.post(
      "/community/comments",
      { postId, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    window.location.reload();
    return response.data;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw error;
  }
};

// 대댓글 생성
export const createChildComment = async (parentId, postId, content, token) => {
  try {
    const response = await axiosInstance.post(
      `/community/comments/${parentId}/child`,
      { postId, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    window.location.reload();
    return response.data;
  } catch (error) {
    console.error("Failed to create child comment:", error);
    throw error;
  }
};

// 댓글 수정
export const updateComment = async (id, content, token) => {
  try {
    const response = await axiosInstance.put(
      `/community/comments/${id}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    alert("댓글이 수정되었습니다.");
    window.location.reload();
    return response.data; // 수정된 댓글 반환
  } catch (error) {
    console.error(`Failed to update comment with ID ${id}:`, error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (id, token) => {
  try {
    await axiosInstance.delete(`/community/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("댓글이 삭제되었습니다.");
    window.location.reload();
  } catch (error) {
    console.error(`Failed to delete comment with ID ${id}:`, error);
    throw error;
  }
};
