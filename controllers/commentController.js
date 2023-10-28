const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.allCommentsOnPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).exec();

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ message: "Error retrieving post" });
  }
};

exports.createComment = [
  body("comment")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Comment can't be empty!"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array(), data: req.body });

    try {
      const newComment = await new Comment({
        comment: req.body.comment,
        user: req.user._id,
        postId: req.params.postId,
      }).save();

      return res
        .status(200)
        .json({ message: "Comment Created", comment: newComment });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Error creating comment: " + error });
    }
  },
];

exports.deleteComment = async (req, res, next) => {
  try {
    if (!req.user || !req.user.admin) {
      return res.status(403).json({
        message: "Permission denied. Only admins can delete comments.",
      });
    }
    let comment = await Comment.findByIdAndRemove(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    console.log(
      `Comment (ID: ${comment._id}) by user (${
        comment.user
      }) was deleted.`
    );

    res.status(200).json({
      message: `Comment by User(ID: ${comment.user}) on Post(ID: ${comment.postId}) was deleted by ${req.user.username}.`,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment" });
  }
};
