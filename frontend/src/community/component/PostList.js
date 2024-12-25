import React, { useEffect, useState } from "react";
import { fetchPosts } from "../api/postApi";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        console.log("Fetched Posts:", data);
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts.");
      }
    };
    getPosts();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!posts || posts.length === 0) {
    return <p>No Posts Available</p>;
  }

  return (
    <div>
      <h1>Post List</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.authorNickname}</h3>
            <p>{post.content}</p>
            {post.imageUrl && (
              <img
                src={`http://localhost:8080${post.imageUrl}`}
                alt="Post"
                style={{ width: "200px", height: "auto" }}
              />
            )}
            <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
