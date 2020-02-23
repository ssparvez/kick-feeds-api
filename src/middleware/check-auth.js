const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // format >>>> Bearer ajshdkasjaklfhj
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.userData = decoded;
    next(); // if sucessfully authed
  } catch (error) {
    return res.status(401).json({
      message: 'Auth Failed'
    })
  }
};