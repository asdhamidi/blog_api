const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");
const postController = require("../controllers/postController");

// Auth methods
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Post methods
router.get("/posts", postController.allPosts);
router.get("/posts/:postId", postController.singlePost);
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);
router.put(
  "/posts/:postId/edit",
  passport.authenticate("jwt", { session: false }),
  postController.editPost
);
router.delete(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  postController.deletePost
);

// Comment methods
router.get("/posts/:postId/comments", commentController.allCommentsOnPost);
router.post(
  "/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  commentController.createComment
);
router.delete(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentController.deleteComment
);

module.exports = router;
