const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.SECRET;

function verifyToken(req, res, next) {
  const reqHeaders = req.headers['authorization'];
  const token = reqHeaders.split(' ')[1];
  if (!token) {
    return res.status(401).json({message: "Unauthorized"});
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({message: "Unauthorized"});
    }
    req.userEmail = decoded.email;
    req.role = decoded.role;
    next();
  });
}

module.exports = {verifyToken}
