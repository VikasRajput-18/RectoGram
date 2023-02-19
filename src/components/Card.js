import React, { useEffect, useState } from "react";
import "./Card.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Card = ({ post, deletePost, fetchPost }) => {
  // const user = useSelector((state) => state?.userReducer?.state);
  const user = JSON.parse(localStorage.getItem("user"));

  const [showLikeUnlike, setShowLikeUnlike] = useState(true);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState("");

  const likeDislikePost = async (postId, type) => {
    if (type === "unlike") {
      setShowLikeUnlike(true);
    } else if (type === "like") {
      setShowLikeUnlike(false);
    }
    const request = { postId: postId };
    await axios.put(`${API_BASE_URL}/${type}`, request, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchPost();
  };

  const sendComment = async (postId) => {
    if (comments) {
      const request = { postId: postId, commentText: comments };
      await axios.put(`${API_BASE_URL}/comment`, request, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPost();

      setComments("");

      setShowComment(false);
    }
  };

  return (
    <div className="singleCard">
      <div className="card shadow-sm">
        <div className="card-body px-2">
          <div className="row">
            <div className="col-8 d-flex align-items-center gap-3">
              <img
                // src="https://cdn.pixabay.com/photo/2017/01/06/23/09/tree-1959267_960_720.jpg"
                src={post?.author?.profileImg}
                className=" profile-pic"
                alt=""
              />
              <div className="d-flex flex-column justify-content-center">
                <span className="fw-bold">{post?.author?.fullName}</span>
                <span className="text-muted fs-6">{post?.location}</span>
              </div>
            </div>
            <div className="col-4">
              {post?.author._id === user.id ? (
                <>
                  <i
                    className="fas fa-ellipsis-v float-end mt-3 fs-4 dropdown"
                    style={{ cursor: "pointer" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="true"
                  ></i>
                  <ul className="dropdown-menu" data-bs-popper="none">
                    <li className="dropdown-item" style={{ cursor: "pointer" }}>
                      Edit
                    </li>
                    <li
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => deletePost(post._id)}
                    >
                      Delete
                    </li>
                  </ul>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="row my-3">
            <div className="col-12">
              <img
                // src="https://cdn.pixabay.com/photo/2020/10/05/08/04/boys-5628502_960_720.jpg"
                src={post?.image}
                className="rounded  postImage"
                alt="user post"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="d-flex align-items-center gap-3">
                {showLikeUnlike ? (
                  <i
                    className="far fa-heart fs-5"
                    style={{ cursor: "pointer" }}
                    onClick={() => likeDislikePost(post._id, "like")}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-heart fs-5 text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => likeDislikePost(post._id, "unlike")}
                  ></i>
                )}

                <i
                  className="far fa-comment fs-5"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowComment(!showComment)}
                ></i>
                <i className="fas fa-paper-plane  fs-5"></i>
              </div>
            </div>
            <div className="col-6">
              <span className="fw-bold float-end">
                {post?.likes.length} likes
              </span>
            </div>
          </div>
          <div className="row">
            <p className="col-12 text-muted h6 mt-2">2 hours ago</p>
          </div>
          {showComment && (
            <div className="d-flex align-items-start gap-2 ps-1 mt-2">
              <textarea
                className="form-control w-75"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              ></textarea>
              <button
                className="sendComment btn btn-success w-25"
                onClick={() => sendComment(post._id)}
              >
                Send
              </button>
            </div>
          )}

          <div className="row allComments">
            {post?.comments?.map((comment) => {
              return (
                <div key={comment._id}>
                  <span className="fw-bold">
                    {comment?.commentedBy?.fullName} : &nbsp;
                  </span>
                  <span className="text-secondary">{comment?.commentText}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
