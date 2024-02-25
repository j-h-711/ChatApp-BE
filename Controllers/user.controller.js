const User = require("../Models/user");
const userController = {};

// 유저 정보 저장
userController.saveUser = async (userName, sid) => {
  let user = await User.findOne({ name: userName });
  // 유저가 없을 경우 새로 유저 만듦
  if (!user) {
    user = new User({
      name: userName,
      token: sid,
      online: true,
    });
  }
  // 있는 경우 토큰이랑 온라인 상태만 변경
  user.token = sid;
  user.online = true;
  await user.save();
};

// 유저 확인
userController.checkUser = async (sid) => {
  const user = await User.findOne({ token: sid });
  if (!user) {
    throw new Error("user not found");
  }
  return user;
};

module.exports = userController;
