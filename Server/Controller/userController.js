const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getConnection } = require("../db/dbConfig");

const register = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;
  console.log('Registration attempt:', { username, firstName, lastName, email });

  if (!email || !password || !username || !firstName || !lastName) {
    return res.status(400).json({
      status: 'error',
      message: "All fields are required"
    });
  }

  try {
    const connection = getConnection();
    const [existingUser] = await connection.execute(
      "SELECT username, userid, email FROM user WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      const field = existingUser[0].username === username ? 'username' : 'email';
      return res.status(400).json({
        status: 'error',
        field: field,
        message: `This ${field} is already registered`
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await connection.execute(
      "INSERT INTO user (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstName, lastName, email, hashedPassword]
  );

    return res.status(201).json({
      status: 'success',
      message: "Registration successful! Please log in.",
      userid: result.insertId
    });
  } catch (err) {
    console.log('Registration error:', err);
    return res.status(500).json({
      status: 'error',
      message: "Registration failed. Please try again."
    });
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
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userid: user[0].userid,
        username: user[0].username,
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
