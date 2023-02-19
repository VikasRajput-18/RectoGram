import Post from "../models/post.js";

const createPostController = async (req, res) => {
  try {
    const { description, location, image } = req.body;
    if (!description || !location || !image) {
      return res.status(401).send({ msg: "Please enter all required fields" });
    }
    req.user.password = undefined;
    const newPost = new Post({
      description,
      location,
      image,
      author: req.user,
    });
    await newPost.save();

    return res.status(200).send({ post: newPost });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "_id fullName profileImg")
      .populate("comments.commentedBy", "_id fullName");
    if (posts) {
      return res.status(200).send({ posts: posts });
    } else {
      return res.status(400).send({ msg: "Error while fetching posts" });
    }
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

const myAllPost = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).populate(
      "author",
      "_id fullName profileImg"
    );
    if (posts) {
      return res.status(200).send({ posts: posts });
    } else {
      return res.status(400).send({ msg: "Error while fetching posts" });
    }
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

const deletePost = async (req, res) => {
  // const post = await Post.findOne({});
  Post.findOne({ _id: req.params.postId })
    .populate("author", "_id")
    .exec((error, postFound) => {
      if (error || !postFound) {
        return res.status(401).send({ error: "Post does not exist" });
      }
      // check if the post user is same as logged in user
      if (postFound.author._id.toString() === req.user._id.toString()) {
        postFound
          .remove()
          .then((data) => {
            return res.status(200).send({ result: data });
          })
          .catch((error) => {
            return res
              .status(400)
              .send({ error: "You are not able to delete this post" });
          });
      }
    });
};

const likePost = async (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("author", "_id fullName")
    .exec((error, result) => {
      if (error) {
        return res.status(400).send({ error });
      }
      return res.status(200).send({ result });
    });
};

const unlikePost = async (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("author", "_id fullName")
    .exec((error, result) => {
      if (error) {
        return res.status(400).send({ error });
      }
      return res.status(200).send({ result });
    });
};

const commentPost = async (req, res) => {
  const comment = {
    commentText: req.body.commentText,
    commentedBy: req.user._id,
  };

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.commentedBy", "_id fullName")
    .populate("author", "_id fullName")
    .exec((error, result) => {
      if (error) {
        return res.status(400).send({ error });
      }
      return res.send(result);
    });
};

export {
  createPostController,
  getAllPost,
  myAllPost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
};
