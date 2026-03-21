const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação que valida o JWT
 * Verifica se o token está presente no header Authorization
 * Formato: Bearer <token>
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu-secret-key');
    req.user = decoded;
    next();
  } catch (_err) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = { authenticate };
