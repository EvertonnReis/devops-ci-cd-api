// Simulação de banco de dados em memória
// Em produção, use MongoDB, PostgreSQL, etc.
const users = new Map();

/**
 * Obtém um usuário por email
 */
const getUserByEmail = (email) => {
  return Array.from(users.values()).find(u => u.email === email);
};

/**
 * Obtém um usuário por ID
 */
const getUserById = (id) => {
  return users.get(id);
};

/**
 * Cria um novo usuário
 */
const createUser = (user) => {
  const id = Date.now().toString(); // ID simples
  const newUser = { id, ...user };
  users.set(id, newUser);
  return newUser;
};

/**
 * Limpa todos os usuários (para testes)
 */
const clearAll = () => {
  users.clear();
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  clearAll,
  users
};
