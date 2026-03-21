const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('../database/users');

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-key-desenvolvimento';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

/**
 * Registra um novo usuário
 * - Valida email e senha
 * - Verifica se usuário já existe
 * - Hash da senha com bcrypt (salt rounds: 10)
 * - Retorna token JWT
 */
const register = async (email, password, name) => {
  // Validações
  if (!email || !password || !name) {
    throw {
      statusCode: 400,
      message: 'Email, senha e nome são obrigatórios'
    };
  }

  if (password.length < 6) {
    throw {
      statusCode: 400,
      message: 'Senha deve ter no mínimo 6 caracteres'
    };
  }

  // Verifica se usuário já existe
  if (getUserByEmail(email)) {
    throw {
      statusCode: 409,
      message: 'Usuário já existe com este email'
    };
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cria novo usuário
  const user = createUser({
    email,
    password: hashedPassword,
    name,
    createdAt: new Date().toISOString()
  });

  // Remove senha da resposta
  const { password: _, ...userWithoutPassword } = user;

  // Gera token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  return {
    user: userWithoutPassword,
    token
  };
};

/**
 * Faz login de um usuário
 * - Valida credenciais
 * - Verifica senha com bcrypt
 * - Retorna token JWT
 */
const login = async (email, password) => {
  // Validações
  if (!email || !password) {
    throw {
      statusCode: 400,
      message: 'Email e senha são obrigatórios'
    };
  }

  // Busca usuário
  const user = getUserByEmail(email);
  if (!user) {
    throw {
      statusCode: 401,
      message: 'Credenciais inválidas'
    };
  }

  // Verifica senha
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw {
      statusCode: 401,
      message: 'Credenciais inválidas'
    };
  }

  // Remove senha da resposta
  const { password: _, ...userWithoutPassword } = user;

  // Gera token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  return {
    user: userWithoutPassword,
    token
  };
};

module.exports = {
  register,
  login
};
