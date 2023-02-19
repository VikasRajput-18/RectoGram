import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [show, setShow] = useState(false);
  const [postDetails, setPostDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadPost, setUploadPost] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [image, setImage] = useState({ preview: "", data: "" });
  const [postInfo, setPostInfo] = useState({
    description: "",
    location: "",
  });
  const navigate = useNavigate();

  const user = useSelector((state) => state?.userReducer?.state);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const uploadImage = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };

    setImage(img);
  };

  const handleClose = () => {
    setShow(false);
    setUploadPost(false);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setPostInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    let formdata = new FormData();
    formdata.append("file", image.data);
    const response = await axios.post(`${API_BASE_URL}/uploadFile`, formdata);
    return response;
  };

  const addPost = async () => {
    try {
      setLoading(true);
      if (image.preview === "") {
        Swal.fire({
          icon: "error",
          title: "Please select an image",
        });
      } else if (postInfo.description === "") {
        Swal.fire({
          icon: "error",
          title: "Please fill the Caption",
        });
      } else if (postInfo.location === "") {
        Swal.fire({
          icon: "error",
          title: "Please fill a location",
        });
      } else {
        const imgRes = await handleImageUpload();
        const postResponse = await axios.post(
          `${API_BASE_URL}/createpost`,
          {
            ...postInfo,
            image: `${API_BASE_URL}/files/${imgRes.data.filename}`,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (postResponse) {
          navigate("/posts");
        }
      }
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error while uploading post",
      });
      setLoading(false);
    }
  };

  const myPost = async () => {
    const getPost = await axios.get(`${API_BASE_URL}/myallpost`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!getPost) {
      Swal.fire({
        icon: "Error",
        title: "Error while fetching post",
      });
    } else {
      // Swal.fire({
      //   icon: "Success",
      //   title: "Successfully fetched post",
      // });
    }
    setMyPosts(getPost.data.posts);
  };
  useEffect(() => {
    myPost();
  }, []);

  const showDetails = (post) => {
    setPostDetails(post);
    setShow(true);
  };

  const handleDeletePost = async (postId) => {
    await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    myPost();
    setShow(false);
  };

  return (
    <div className="container bg-white shadow mt-3 p-4 rounded px-2 px-sm-5">
      <div className="row">
        <div className="col-md-6 d-flex flex-column">
          <img
            src="https://cdn.pixabay.com/photo/2016/11/21/14/53/man-1845814_960_720.jpg"
            className="profile_pic"
            alt="PROFILE PIC"
          />
          <h4 className="fw-bold ms-1 fs-5 mt-3">{storedUser.fullName}</h4>
          <h4 className="ms-1 fs-6 text-muted">{storedUser.fullName}</h4>
          <h4 className="ms-1 fs-6 text-muted">
            Frontend Developer | <span className="text-primary">@coderweb</span>{" "}
          </h4>
          <h4 className="ms-1 fs-6 text-dark">Set Your Heart Ablaze 🔥</h4>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-between">
          <div className="d-flex justify-content-sm-end justify-content-start my-3 my-sm-0">
            <div className="count-section d-flex flex-column justify-content-center pe-5 ps-sm-0 ps-3">
              <h4 className="pt-3 text-center">{myPosts.length}</h4>
              <p>Posts</p>
            </div>
            <div className="count-section d-flex flex-column justify-content-center pe-5 ps-sm-5 ps-3">
              <h4 className="pt-3 text-center">389</h4>
              <p>Followers</p>
            </div>
            <div className="ps-sm-5 ps-3 d-flex flex-column justify-content-center">
              <h4 className="pt-3 text-center">151</h4>
              <p>Following</p>
            </div>
          </div>
          <div className="d-flex justify-content-sm-end justify-content-center gap-4">
            <button className="outline-none px-sm-5 px-3 py-sm-3 py-2 text-primary shadow btn fs-5 fw-bold rounded-3 border-1 border-light">
              Edit Profile
            </button>
            <button
              className="outline-none px-sm-5 py-sm-3 py-2 px-3 fs-5 fw-bold rounded-3 border-1 border-light text-success btn shadow"
              onClick={() => setUploadPost(true)}
            >
              Upload Post
            </button>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <div className="col-3"></div>
      </div>
      <div className="row mb-3">
        {myPosts?.map((post) => {
          return (
            <div className="col-md-4 col-12" key={post?._id}>
              <div className="card mb-md-4 mb-3" style={{ height: "400px" }}>
                <img
                  src={post?.image}
                  className="card-img-top h-100 img-fluid"
                  style={{ objectFit: "cover" }}
                  alt="..."
                  onClick={() => showDetails(post)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6 col-12">
              <div
                id="carouselExampleIndicators"
                className="carousel slide"
                data-bs-ride="true"
              >
                <div className="carousel-indicators">
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="0"
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"
                  ></button>
                </div>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src={postDetails?.image}
                      className="d-block w-100 rounded carousel-image"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src={postDetails?.image}
                      className="d-block w-100 rounded carousel-image"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src={postDetails?.image}
                      className="d-block w-100 rounded carousel-image"
                      alt="..."
                    />
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            <div className="col-md-6 col-12 mt-4 mt-sm-0">
              <div className="row">
                <div className="col-8 d-flex align-items-center gap-3">
                  <img
                    src="https://cdn.pixabay.com/photo/2017/01/06/23/09/tree-1959267_960_720.jpg"
                    className=" profile-pic"
                    alt=""
                  />
                  <div className="d-flex flex-column justify-content-center">
                    <span className="fw-bold">
                      {postDetails?.author?.fullName}
                    </span>
                    <span className="text-muted fs-6">
                      {postDetails?.location}
                    </span>
                  </div>
                </div>
                <div className="col-4 dropdown">
                  <i
                    className="fas fa-ellipsis-v float-end mt-3 fs-4 "
                    style={{ cursor: "Pointer" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></i>
                  <ul className="dropdown-menu">
                    <li>
                      <p className="dropdown-item d-flex align-items-center gap-3 ps-3">
                        <i className="fas fa-edit"></i>
                        Edit Post
                      </p>
                    </li>
                    <li>
                      <p
                        className="dropdown-item d-flex align-items-center gap-3 ps-3"
                        onClick={() => handleDeletePost(postDetails?._id)}
                      >
                        <i className="fas fa-trash"></i>
                        Delete Post
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="row">
                <div className="col-12 mt-3">
                  <p>{postDetails?.description}</p>
                </div>
              </div>

              <div className="row my-3">
                <div className="col-6 mt-2">
                  <div className="d-flex align-items-center gap-3">
                    <i className="far fa-heart fs-5"></i>
                    <i className="far fa-comment fs-5"></i>
                    <i className="fas fa-paper-plane fs-5"></i>
                  </div>
                </div>
                <div className="col-12 my-3">
                  <span className="fw-bold">
                    {postDetails?.likes?.length} likes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={uploadPost} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <span className="uploadpost_popup_title">Upload Post</span>
        </Modal.Header>
        <Modal.Body>
          <div className="row gap-md-0 gap-3">
            <div className="col-md-6 col-12">
              <div className="upload_box">
                {image?.preview ? (
                  <>
                    <label htmlFor="upload_file" className="w-100 h-100">
                      <img
                        src={image?.preview}
                        alt="upload post"
                        className="w-100 h-100 rounded"
                        style={{ objectFit: "cover" }}
                      />
                    </label>

                    <input
                      type="file"
                      id="upload_file"
                      className="d-none"
                      onChange={(e) => uploadImage(e)}
                    />
                  </>
                ) : (
                  <>
                    {" "}
                    <i className="fas fa-cloud fs-1"></i>
                    <input
                      type="file"
                      id="upload_file"
                      className="d-none"
                      onChange={(e) => uploadImage(e)}
                    />
                    <label
                      htmlFor="upload_file"
                      className="text-primary mt-2 fs-5"
                    >
                      Upload from your computer
                    </label>{" "}
                  </>
                )}
              </div>
            </div>
            <div className="col-md-6 col-12 ">
              <div className="row">
                <div className="col-12 d-flex flex-column gap-2">
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      placeholder="Add Caption"
                      id="floatingTextarea"
                      name="description"
                      value={postInfo.description}
                      onChange={handleChange}
                    ></textarea>
                    <label htmlFor="floatingTextarea">Add Caption</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Add Location"
                      name="location"
                      value={postInfo.location}
                      onChange={handleChange}
                    />
                    <label htmlFor="floatingInput">
                      <i className="fas fa-map-marker"></i> Add Location
                    </label>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <button className="postButton" onClick={addPost}>
                    {loading ? (
                      <div className="spinner-border text-light" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      "Post"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
