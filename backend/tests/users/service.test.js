// usersService.test.js
const UsersService = require('../../data/users/service'); // ajusta o path conforme necessário
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');

// Simula as funções do bcrypt e jwt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UsersService', () => {
  let UsersModel;
  let usersService;

  beforeEach(() => {
    // Cria um mock para o UsersModel
    // UsersModel será usado como função construtora e terá também o método findOne
    UsersModel = jest.fn();
    UsersModel.findOne = jest.fn();

    // Cria uma implementação padrão para o construtor
    const instance = {
      save: jest.fn()
    };
    UsersModel.mockImplementation((user) => instance);

    // Cria o serviço passando o UsersModel mockado
    usersService = UsersService(UsersModel);
  });

  test('deve lançar erro se email ou username já existir', async () => {
    // Simula que o findOne encontra um utilizador existente
    UsersModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ email: 'teste@exemplo.com' })
    });
    const user = { email: 'teste@exemplo.com', username: 'teste', password: 'pass123' };

    await expect(usersService.create(user))
      .rejects
      .toThrow("Email or username already exists");
  });

  test('deve criar um utilizador com sucesso', async () => {
    // Simula que findOne não encontra utilizador existente
    UsersModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null)
    });
    // Simula bcrypt.hash para retornar um hash
    bcrypt.hash.mockResolvedValue('hashedPassword');

    // Cria um mock para o método save do modelo
    const savedUser = { _id: '1', email: 'teste@exemplo.com', username: 'teste', password: 'hashedPassword' };
    const instance = {
      save: jest.fn().mockResolvedValue(savedUser)
    };
    // Faz com que o construtor UsersModel retorne este instance
    UsersModel.mockImplementation(() => instance);

    const user = { email: 'teste@exemplo.com', username: 'teste', password: 'pass123' };
    const result = await usersService.create(user);

    expect(result.message).toBe("User saved successfully");
    expect(result.user).toEqual(savedUser);
  });

  test('deve retornar token quando createToken é chamado', () => {
    const user = { _id: '1', name: 'Teste', role: { scopes: ['user'] } };
    const fakeToken = "fake.token.here";
    jwt.sign.mockReturnValue(fakeToken);

    const tokenObj = usersService.createToken(user);

    expect(tokenObj.auth).toBe(true);
    expect(tokenObj.token).toBe(fakeToken);
    expect(tokenObj.expiresIn).toBe(config.expiresToken);
  });

  test('deve rejeitar login com credenciais incorretas', async () => {
    // Simula que findOne encontra um usuário
    const fakeUser = { email: 'teste@exemplo.com', password: 'hashedPassword' };
    UsersModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(fakeUser)
    });
    // Simula que comparePassword retorna false (senha incorreta)
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    const loginData = { email: 'teste@exemplo.com', password: 'wrongPassword' };

    await expect(usersService.findUser(loginData))
      .rejects
      .toThrow('Password incorrect');
  });

  test('deve efetuar login com sucesso', async () => {
    // Simula que findOne encontra um usuário válido
    const fakeUser = { email: 'teste@exemplo.com', password: 'hashedPassword' };
    UsersModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(fakeUser)
    });
    // Simula que bcrypt.compare retorna true (senha correta)
    bcrypt.compare = jest.fn().mockResolvedValue(true);
  
    const loginData = { email: 'teste@exemplo.com', password: 'pass123' };
    const user = await usersService.findUser(loginData);
  
    expect(user).toEqual(fakeUser);
  });
});
