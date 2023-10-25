const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 20 },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  member: { type: Boolean, default: false },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("User", UserSchema);
