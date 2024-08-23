const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chat: String,
  user: {
    id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    name: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const roomSchema = new mongoose.Schema(
  {
    room: String,
    password: { type: String, required: true },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        unique: false,
      },
    ],
    host: String,
    chats: [chatSchema],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Room", roomSchema);
