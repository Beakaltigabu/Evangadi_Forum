const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
     // console.log('No token provided or invalid token format');
      return res.status(401).json({ msg: 'Authentication invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userid: decoded.userid, username: decoded.username };
      next();
    } catch (error) {
      console.log('Token verification failed:', error.message);
      return res.status(401).json({ msg: 'Authentication invalid' });
    }
};

module.exports = authMiddleware;
