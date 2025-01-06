import React, { useState } from "react";
import { useSelector } from "react-redux";
import FollowButton from "../FollowButton";
import LikeButton from "../LikeButton";
import CommentList from "../comment/CommentList";
import "../scss/profile/PostDetailModal.css";

const PostDetailModal = ({ post, onClose, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const currentNickname = useSelector((state) => state.loginSlice.nickname);
  const token = useSelector((state) => state.loginSlice.accessToken);
  const isOwner = currentNickname === post.authorNickname;
  const [editedImage, setEditedImage] = useState();

  const handleSave = () => {
    onEdit(post.id, { content: editedContent }, editedImage);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(post.content);
    setEditedImage(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(post.id);
    onClose();
  };

  return (
    <div className="post-detail-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-left">
          <img
            src={`http://localhost:8080${post.imageUrl}`}
            alt="Post Detail"
          />
        </div>
        <div className="modal-right">
          <div className="post-header">
            <span className="author">{post.authorNickname}</span>
            {!isOwner && <FollowButton targetNickname={post.authorNickname} />}
            <span className="created-at">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="post-body">
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="edit-content"
              />
            ) : (
              <p>{post.content}</p>
            )}
          </div>
          <div className="post-actions">
            <LikeButton id={post.id} token={token} />
            {isOwner && !isEditing && (
              <div className="owner-actions">
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  Edit
                </button>
                <button onClick={handleDelete} className="delete-btn">
                  Delete
                </button>
              </div>
            )}
            {isEditing && (
              <div className="edit-actions">
                <button onClick={handleSave} className="save-btn">
                  Save
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="post-comments">
            <CommentList postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
