const config = require('../../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function UsersService(UsersModel) {

  let service = {
    create,
    save,
    createToken,
    verifyToken,
    authorize,
    findUser,
  };

  function create(user) {
    return UsersModel.findOne({
      $or: [
        { email: user.email },
        { username: user.username }
      ]
    }).exec()
      .then((existingUser) => {
        if (existingUser) {
          throw new Error("Email or username already exists");
        }
        return createPassword(user);
      })
      .then((hashPassword) => {
        let newUserWithPassword = {
          ...user,
          password: hashPassword,
        };
        let newUser = UsersModel(newUserWithPassword);
        return save(newUser)
      });
  }

  function save(model) {
    return model.save(model)
      .then((savedUser) => {
        return {
          message: "User saved successfully",
          user: savedUser
        };
      })
      .catch((err) => {
        console.error(err);
        throw new Error("Failed saving the user: " + err);
      });
  }

  function findUser({ email, password }) {
    return UsersModel.findOne({ email }).exec()
      .then((user) => {
        if (!user) {
          return Promise.reject(new Error("User not found"));
        }
        return comparePassword(password, user.password)
          .then((match) => {
            if (!match) {
              return Promise.reject(new Error("Password incorrect"));
            }
            return user;
          });
      })
      .catch((err) => {
        //Esta condição é necessária para o teste unitário funcionar corretamente
        if (err.message === "Password incorrect" || err.message === "User not found") {
          return Promise.reject(err);
        }
        return Promise.reject('There is a problem with login:' + err);
      });
  }

  function createToken(user) {
    let token = jwt.sign({ id: user._id, name: user.name, role: user.role.scopes },
      config.secret,
      {
        expiresIn: config.expiresToken,
      }
    );

    return { auth: true, token, expiresIn: config.expiresToken };
  }

  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject();
        }
        return resolve(decoded);
      });
    });
  }

  function authorize(scopes) {
    return (request, response, next) => {
      const { roleUser } = request;
      const hasAutorization = scopes.some(scopes => roleUser.includes(scopes));

      if (roleUser && hasAutorization) {
        next();
      } else {
        response.status(403).json({ message: "Forbidden" });
      }
    };
  }

  function createPassword(user) {
    return bcrypt.hash(user.password, config.saltRounds);
  }

  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  return service;
}

module.exports = UsersService;