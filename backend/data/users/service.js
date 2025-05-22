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

  /*function create(user) {
    return UsersModel.findOne({username: user.username}).exec()
      .then((existingUserByEmail) => {
        if (existingUserByEmail) {
          throw new Error("Email already exists");
        }
        return UsersModel.findOne({username: user.username}).exec();
      })
      .then((existingUserByUsername) => {
        if(existingUserByUsername) {
          throw new Error("Username already exists");
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
  }*/

  async function create(user) {
    try {
      const existingUserByEmail = await UsersModel.findOne({ email: user.email });
      if (existingUserByEmail) {
        throw new Error("Email already exists");
      }

      const existingUserByUsername = await UsersModel.findOne({ username: user.username });
      if (existingUserByUsername) {
        throw new Error("Username already exists");
      }
      const hashPassword = await createPassword(user);
      const newUserWithPassword = {
        ...user,
        password: hashPassword,
      };
      const newUser = new UsersModel(newUserWithPassword);
      return save(newUser);
    } catch (err) {
      throw new Error("Failed creating the user");
    }
  }

  async function save(model) {
    try {
      const savedUser = await model.save();
      return {
        message: "User saved successfully",
        user: savedUser
      }

    } catch (err) {
      console.error(err);
      throw new Error("Failed saving the user:");
    }
  }

  /*function findUser({ email, password }) {
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
  }*/

  async function findUser({email, password}){
    try {
      const user = await UsersModel.findOne({email});
      if (!user) {
        throw new Error("User not found");
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        throw new Error("Password incorrect");
      }
      return user;
    }
     catch (err) {
      console.error(err);
      throw new Error("Failed finding the user");
     }
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

  async function verifyToken(token) {
    try{
      const decoded = await jwt.verify(token, config.secret);
      return decoded;
    }
    catch (err) {
      console.error(err);
      throw new Error("Failed verifying the token");
    }
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