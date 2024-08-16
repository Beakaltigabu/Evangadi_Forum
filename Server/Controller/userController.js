const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getConnection } = require("../db/dbConfig");

const register = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  if (!email || !password || !username || !firstName || !lastName) {
    return res.status(400).json({ message: "Please Provide all required Fields!" });
  }

  try {
    const connection = getConnection();
    const [user] = await connection.execute(
      "SELECT username, userid FROM user WHERE username = ? OR email = ?",
      [username, email]
    );

    if (user.length > 0) {
      return res.status(400).json({ message: "This User Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connection.query(
      "INSERT INTO user (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstName, lastName, email, hashedPassword]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Something went wrong, try again Later" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please Enter Email And Password!" });
  }

  try {
    const connection = getConnection();
    const [user] = await connection.execute(
      "SELECT username, userid, password FROM user WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(400).json({ message: "There is no User with this email" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "The Password is Not Correct!" });
    }

    const token = jwt.sign(
      {
        userid: user[0].userid,
        username: user[0].username,
        email: user[0].email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      message: "Login successful",
      username: user[0].username,
      userid: user[0].userid,
      token,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Something went wrong, try again Later" });
  }
};


const checkUsers = async (req, res) => {
  const username = req.user.username;
  const userid = req.user.userid;
  return res.status(200).json({ message: "success", username, userid });
};

module.exports = { register, login, checkUsers };
