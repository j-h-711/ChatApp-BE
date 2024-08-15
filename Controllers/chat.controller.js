const Chat = require("../Models/chat");
const Room = require("../Models/room");
const chatController = {};

chatController.saveChat = async (message, user) => {
  try {
    // 사용자가 속한 방을 찾습니다.
    const room = await Room.findById(user.room);

    if (!room) {
      throw new Error("Room not found");
    }

    // 새로운 메시지를 room의 chats 배열에 추가합니다.
    const newChat = {
      chat: message,
      user: {
        id: user._id,
        name: user.name,
      },
      createdAt: new Date(), // 메시지 작성 시간을 추가합니다.
    };

    room.chats.push(newChat); // 방의 chats 배열에 새로운 메시지를 추가합니다.
    await room.save(); // 방을 저장합니다.

    return newChat; // 추가된 메시지를 반환합니다.
  } catch (e) {
    console.error("Error saving chat:", e);
    throw e;
  }
};

module.exports = chatController;

// chatController.saveChat = async (message, user) => {
//   const newChat = new Chat({
//     chat: message,
//     user: {
//       id: user._id,
//       name: user.name,
//     },
//     room: user.room, // 메세지에 채팅방 정보도 저장하는 부분 추가!
//   });
//   await newChat.save();
//   return newChat;
// };

// module.exports = chatController;
