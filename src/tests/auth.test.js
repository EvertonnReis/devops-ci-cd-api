const express = require('express');
const request = require('supertest');
const app = require('../index');
const { errorHandler } = require('../middleware/errorHandler');
const { clearAll } = require('../database/users');

describe('Auth API - Testes de integração', () => {

  describe('POST /api/auth/register', () => {
    beforeAll(() => {
      clearAll(); // Limpa banco antes dos testes de registro
    });
    it('deve registrar um novo usuário com sucesso', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('email');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('deve retornar erro se campos obrigatórios estão faltando', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro se senha é muito curta', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test'
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve retornar erro se usuário já existe', async () => {
      // Primeiro cadastro
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'Test User'
        });

      // Tenta cadastro duplicado
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'Test User'
        });

      expect(response.statusCode).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(() => {
      clearAll(); // Limpa banco antes dos testes de login
    });

    beforeEach(async () => {
      // Registra um usuário antes de testar login
      const uniqueEmail = `login-test-${Date.now()}@example.com`;
      await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'password123',
          name: 'Login Test'
        });

      this.testEmail = uniqueEmail;
    });

    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: this.testEmail,
          password: 'password123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: this.testEmail,
          password: 'wrong-password'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro se usuário não existe', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeAll(() => {
      clearAll(); // Limpa banco antes dos testes de me
    });

    beforeEach(async () => {
      const uniqueEmail = `me-test-${Date.now()}@example.com`;
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'password123',
          name: 'Me Test'
        });

      token = registerRes.body.data.token;
    });

    it('deve retornar dados do usuário com token válido', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('email');
    });

    it('deve verificar middleware auth chamado com token válido', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('name');
    });

    it('deve retornar erro sem token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro com token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    it('deve retornar status de saúde', async () => {
      const response = await request(app).get('/health');

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('UP');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Auth Middleware - Cobertura de branches', () => {
    it('deve rejeitar header Authorization sem "Bearer "', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Basic dXNlcjpwYXNz');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('deve rejeitar header Authorization vazio', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', '');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('deve rejeitar "Bearer " sem token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer ');

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handler - Middleware de erros', () => {
    beforeAll(() => {
      // Salvar NODE_ENV original
      this.originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
    });

    afterAll(() => {
      // Restaurar NODE_ENV original
      process.env.NODE_ENV = this.originalNodeEnv;
    });

    it('deve retornar erro com statusCode customizado', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'pass',
          name: 'Test'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('deve usar statusCode 500 como fallback quando não definido', async () => {
      // Chama endpoint de teste que lança erro genérico
      const response = await request(app).get('/test/error');

      // Erro genérico sem statusCode deve retornar 500
      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.statusCode).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('deve usar mensagem default quando erro não tem message', async () => {
      // Chama endpoint de teste que lança erro sem message
      const response = await request(app).get('/test/error-empty');

      // Erro sem message deve usar a mensagem default
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Erro interno do servidor');
    });

    it('deve incluir stack trace quando NODE_ENV é development', async () => {
      process.env.NODE_ENV = 'development';

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'short',
          name: 'Test'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('stack');
    });

    it('deve não incluir stack trace quando NODE_ENV é production', async () => {
      process.env.NODE_ENV = 'production';

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'short',
          name: 'Test'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.stack).toBeUndefined();
    });
  });
});

