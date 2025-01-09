const buildCommentTree = (comments) => {
  const commentMap = {};
  const roots = [];

  comments.forEach((comment) => {
    comment.children = [];
    commentMap[comment.id] = comment;

    if (!comment.parentId) {
      roots.push(comment); // parent_id가 null이면 최상위 댓글
    } else {
      const parent = commentMap[comment.parentId];
      if (parent) {
        parent.children.push(comment); // 부모 댓글의 children에 대댓글 추가
      }
    }
  });

  return roots; // 최상위 댓글 배열 반환
};

export default buildCommentTree;
