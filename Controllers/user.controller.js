const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../Models/user");
const userController = {};

// 회원 가입
userController.registerUser = async (regisName, regisPassword) => {
  // 이미 등록된 사용자인지 확인
  const existingUser = await User.findOne({ name: regisName });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(regisPassword, 10);

  // 새 사용자 생성 및 저장
  const newUser = new User({
    name: regisName,
    password: hashedPassword,
    online: false,
    token: null,
  });
  await newUser.save();
};

// 로그인
userController.loginUser = async (userName, password, sid) => {
  console.log(userName, password, sid);
  // 사용자 확인
  const user = await User.findOne({ name: userName }).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  // 비밀번호 확인
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Incorrect password");
  }
  // 토큰 및 온라인 상태 업데이트
  user.token = sid;
  user.online = true;
  await user.save();

  return user;
};

// 유저 확인
userController.checkUser = async (sid) => {
  const user = await User.findOne({ token: sid });
  if (!user) {
    throw new Error("user not found");
  }
  console.log(user);
  return user;
};

module.exports = userController;
