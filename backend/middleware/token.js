const Users = require('../data/users');

module.exports = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.status(401).send({
        auth: false,
        message: 'No token provided.'
      });
    }

    const decoded = await Users.verifyToken(token);
    req.id = decoded.id;
    req.roleUser = decoded.role;
    next();
  } catch (error) {
    res.status(401).send({
      auth: false,
      message: 'Not authorized'
    });
  }
};
