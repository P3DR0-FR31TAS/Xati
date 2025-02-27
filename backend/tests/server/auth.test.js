const request = require('supertest');
const app = require('../../index');

describe('Testes de Autenticação', () => {

  it('Deve realizar registo com credenciais válidas', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'usuario@exemplo.com', password: 'senhaCorreta' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  }, 40000);

  it('Deve realizar login com credenciais válidas', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'usuario@exemplo.com', password: 'senhaCorreta' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  }, 40000);

  it('Deve falhar ao realizar login com credenciais inválidas', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'usuario@exemplo.com', password: 'senhaIncorreta' });

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
});

afterAll(async () => {
  const mongoose = require('mongoose');
  await mongoose.connection.close(); // Fecha a conexão da BD para evitar leaks no Jest
});
