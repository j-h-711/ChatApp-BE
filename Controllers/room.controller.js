const Room = require("../Models/room");
const roomController = {};

roomController.getAllRooms = async () => {
  const roomList = await Room.find({});
  return roomList;
};

roomController.joinRoom = async (roomId, user) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("해당 방이 없습니다.");
  }
  if (!room.members.includes(user._id)) {
    room.members.push(user._id);
    await room.save();
  }
  user.room = roomId;
  await user.save();
};

roomController.leaveRoom = async (user) => {
  const room = await Room.findById(user.room);
  if (!room) {
    throw new Error("Room not found");
  }
  room.members.remove(user._id);
  await room.save();
};

// 방 신규 추가
roomController.addRoom = async (roomName, userId) => {
  try {
    const newRoom = new Room({ room: roomName, host: userId });
    await newRoom.save();
    return newRoom;
  } catch (error) {
    throw new Error("Failed to add room");
  }
};

// 방 삭제
roomController.deleteRoom = async (roomId, userId) => {
  try {
    const room = await Room.findById(roomId);

    //현재 클라이언트쪽에서 host와 로그인 유저 확인함
    // TODO: 아래 주석 부분쪽에서 서버단에서 유저 재검증 필요

    // if (!room) {
    //   throw new Error("Room not found");
    // }
    // if (room.host !== userId) {
    //   throw new Error("You are not authorized to delete this room");
    // }
    await room.deleteOne();
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = roomController;
