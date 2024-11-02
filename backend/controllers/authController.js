const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Session = require("../models/Session");

const generateToken = (user, expiresIn) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  await user.save();
  res.status(201).json({ message: "User registered" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateToken(user, process.env.JWT_ACCESS_EXPIRATION);
  const refreshToken = generateToken(user, process.env.JWT_REFRESH_EXPIRATION);

  await new Session({ userId: user._id, refreshToken }).save();

res.cookie("refreshToken", refreshToken, {  // set refresh token in cookie
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    path: '/',
    secure: false
});
  res.status(200).json({ message: "login success!",token : accessToken }); // return access token to client
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const session = await Session.findOne({ userId: payload.id, refreshToken });
    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = generateToken({ id: payload.id }, process.env.JWT_ACCESS_EXPIRATION);
    res.json({token: accessToken });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) await Session.findOneAndDelete({ refreshToken });
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};
