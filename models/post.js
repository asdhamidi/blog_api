var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: { type: String, required: true, minLength: 1, maxLength: 35 },
  subtitle: { type: String, required: true, minLength: 1, maxLength: 50 },
  content: { type: String, required: true, minLength: 1 },
  user: { type: Schema.Types.ObjectId, ref: "User", requried: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  timeStamp: { type: Date, default: Date.now, requried: true },
  published: { type: Boolean, default: false },
});

module.exports = mongoose.model("Post", PostSchema);
