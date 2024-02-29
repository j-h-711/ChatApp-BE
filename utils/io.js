const userController = require("../Controllers/user.controller");
const chatController = require("../Controllers/chat.controller");
const roomController = require("../Controllers/room.controller");

module.exports = function (io) {
  // io와 관련된 모든 작업

  io.on("connection", async (socket) => {
    console.log("user is connected");

    // 회원 가입
    socket.on("register", async (regisName, regisPassword, cb) => {
      // console.log(regisName, regisPassword);
      try {
        await userController.registerUser(regisName, regisPassword);
        cb({ ok: true, message: "User registered successfully" });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    // 유저정보 저장
    socket.on("login", async (userName, password, cb) => {
      try {
        const user = await userController.loginUser(
          userName,
          password,
          socket.id
        );
        cb({ ok: true, data: user });
      } catch (e) {
        cb({ ok: false, error: e.message });
      }
    });

    socket.on("joinRoom", async (rid, cb) => {
      try {
        const user = await userController.checkUser(socket.id); // 일단 유저정보들고오기
        await roomController.joinRoom(rid, user); // 1~2작업
        socket.join(user.room.toString()); //3 작업
        const welcomeMessage = {
          chat: `${user.name} is joined to this room`,
          user: { id: null, name: "system" },
        };
        io.to(user.room.toString()).emit("message", welcomeMessage); // 4 작업
        io.emit("rooms", await roomController.getAllRooms()); // 5 작업
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    socket.on("sendMessage", async (receivedMessage, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        if (user) {
          const message = await chatController.saveChat(receivedMessage, user);
          io.to(user.room.toString()).emit("message", message); // 이부분을 그냥 emit에서 .to().emit() 으로 수정
          return cb({ ok: true });
        }
      } catch (e) {
        cb({ ok: false, error: e.message });
      }
    });

    socket.emit("rooms", await roomController.getAllRooms()); // 룸 리스트 보내기

    socket.on("leaveRoom", async (_, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        await roomController.leaveRoom(user);
        const leaveMessage = {
          chat: `${user.name} left this room`,
          user: { id: null, name: "system" },
        };
        socket.broadcast.to(user.room.toString()).emit("message", leaveMessage); // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다
        io.emit("rooms", await roomController.getAllRooms());
        socket.leave(user.room.toString()); // join했던 방을 떠남
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("user is disconnected");
    });
  });
};
