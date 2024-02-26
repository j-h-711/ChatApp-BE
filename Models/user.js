const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must type name"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "User must type password"],
    select: false, // 비밀번호를 항상 해시된 형태로 응답하도록 설정
  },
  token: {
    type: String,
  },
  online: {
    type: Boolean,
    default: false,
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
  },
});

module.exports = mongoose.model("User", userSchema);
