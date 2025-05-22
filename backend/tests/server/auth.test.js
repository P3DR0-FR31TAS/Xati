const request = require('supertest');
const app = require('../../index');
//const User = require('../../data/users'); // Ajuste o caminho conforme necessário
const mongoose = require('mongoose');

const User = mongoose.models.User || mongoose.model('User');

describe('Testes de Autenticação', () => {

  beforeAll(async () => {
    // Limpar usuário antes dos testes
    try {
      // Verificamos o modelo e usamos o método apropriado
      if (User.findOneAndDelete) {
        await User.findOneAndDelete({ email: 'usuario@exemplo.com' });
      } else if (User.deleteMany) {
        await User.deleteMany({ email: { $in: 'usuario@exemplo.com' } });
      } else {
        console.log('Modelo User não possui métodos de deleção padrão');
      }
    } catch (error) {
      console.log('Erro ao limpar usuários:', error);
    }
  });

  it('Deve realizar registo com sucesso e retornar token', async () => {

    const userData = {
      username: "usernameExemplo",
      name: "nome exemplo",
      email: 'usuario@exemplo.com',
      password: 'senhaCorreta',
      role: {
        name: "user",
        scopes: ["user"]
      },
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    console.log('Resposta do registo:', response.status, response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  }, 40000);

  it('Deve falhar ao realizar registo com credenciais existentes', async () => {

    const userData = {
      username: "usernameExemplo",
      name: "nome exemplo",
      email: 'usuario@exemplo.com',
      password: 'senhaCorreta',
      role: {
        name: "user",
        scopes: ["user"]
      },
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    console.log('Resposta da falha do registo:', response.status, response.body);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Email or username already exists');
  }, 40000);

  it('Deve falhar ao realizar registo com credenciais em falta', async () => {
    //User com name em falta
    const userData = {
      username: "usernameExemplo2",
      email: 'usuario2@exemplo.com',
      password: 'senhaCorreta',
      role: {
        name: "user",
        scopes: ["user"]
      },
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    console.log('Resposta da falha do registo:', response.status, response.body);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('ValidationError');
    expect(response.body.error).toContain('name');
    expect(response.body.error).toContain('required');
  }, 40000);

  it('Deve realizar login com credenciais válidas', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'usuario@exemplo.com', password: 'senhaCorreta' });

    console.log('Resposta do login:', response.status, response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  }, 40000);

  it('Deve falhar ao realizar login com credenciais inválidas', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'usuario@exemplo.com', password: 'senhaIncorreta' });

    console.log('Resposta da falha do login:', response.status, response.body);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Password incorrect');
  }, 40000);

  it('Deve realizar logout e remover o cookie', async () => {
    const agent = request.agent(app);

    // Faz login para obter o token
    const loginResponse = await agent
      .post('/auth/login')
      .send({ email: 'usuario@exemplo.com', password: 'senhaCorreta' });

    // Verifica se o login foi bem-sucedido
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');

    const response = await agent
      .get('/auth/logout')

    // Verifica se a resposta do logout está correta
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('auth', false);
    expect(response.body).toHaveProperty('logout', true);
    expect(response.body).toHaveProperty('message', 'Loged out successfully');

    // Verifica se o cookie foi removido
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Max-Age=0/),
      ])
    );
  }, 40000);

  afterAll(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close(); // Fecha a conexão da BD para evitar leaks no Jest
  });
});

