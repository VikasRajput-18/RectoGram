import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";

const PostOverview = () => {
  const [posts, setPosts] = useState();

  const fetchPost = async () => {
    const getPost = await axios.get(`${API_BASE_URL}/allpost`);
    if (!getPost) {
      Swal.fire({
        icon: "Error",
        title: "Error while fetching post",
      });
    }

    setPosts(getPost.data.posts);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleDeletePost = async (postId) => {
    await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  };

  return (
    <div className="d-flex justify-content-center flex-wrap gap-4 mt-5 ">
      {posts?.map((post) => (
        <Card
          post={post}
          key={post?._id}
          deletePost={handleDeletePost}
          fetchPost={fetchPost}
        />
      ))}
    </div>
  );
};

export default PostOverview;
