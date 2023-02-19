import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      commentText: String,
      commentedBy: { type: ObjectId, ref: "User" },
    },
  ],
  image: {
    type: String,
    required: true,
  },
  author: {
    type: ObjectId,
    ref: "User",
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
