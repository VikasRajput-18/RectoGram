import express from "express";
import {
  commentPost,
  createPostController,
  deletePost,
  getAllPost,
  likePost,
  myAllPost,
  unlikePost,
} from "../controllers/post.js";
import protectedResources from "../middleware/protectedResources.js";
const router = express.Router();

router.get("/allpost", getAllPost);
router.get("/myallpost", protectedResources, myAllPost);
router.post("/createpost", protectedResources, createPostController);
router.delete("/deletepost/:postId", protectedResources, deletePost);
router.put("/like", protectedResources, likePost);
router.put("/unlike", protectedResources, unlikePost);
router.put("/comment", protectedResources, commentPost);

export default router;
