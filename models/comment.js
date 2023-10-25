var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  comment: { type: String, required: true, minLength: 1, maxLength: 250 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  timeStamp: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("Comment", CommentSchema);
