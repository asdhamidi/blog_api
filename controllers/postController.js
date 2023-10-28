const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.allPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).sort({ timeStamp: 1 }).exec();

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Error creating post" });
  }
};

exports.singlePost = async (req, res, next) => {
  try {
    const getPost = await Post.find({ _id: req.params.postId }).exec();
    if (getPost) {
      return res.status(200).json({ post: getPost });
    }
  } catch (error) {
    console.error("Error in finding Post", error);
    res.status(500).json({ message: "Error getting Post" });
  }
};

exports.createPost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Add a title to your post!"),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Add content to your blog post"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array(), data: req.body });

    try {
      const newPost = await new Post({
        title: req.body.title,
        subtitle: req.body.subtitle,
        content: req.body.content,
        user: req.user._id,
      }).save();

      res.status(200).json({ message: "Post Created", post: newPost });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Error creating post" });
    }
  },
];

exports.editPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    post.title = req.body.title;
    post.subtitle = req.body.subtitle;
    post.content = req.body.content;

    post.save();

    console.log(`Post (ID: ${post._id}) by user (${post.user}) was edited by ${req.user.username}.`);
    res.status(200).json({ message: "Post Edited", post: post });
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).json({ message: "Error editing post" });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    if (!req.user || !req.user.admin) {
      return res
        .status(403)
        .json({ message: "Permission denied. Only admins can delete posts." });
    }

    const deletedPost = await Post.findByIdAndRemove(req.params.postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    console.log(
      `Post (ID: ${deletedPost._id}) by user (${deletedPost.user}) was deleted.`
    );

    res.status(200).json({
      message: `Post by User(ID: ${deletedPost.user}) was deleted by ${req.user.username}.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post:", error });
  }
};
