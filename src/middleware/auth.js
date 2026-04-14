const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação que valida o JWT
 * Verifica se o token está presente no header Authorization
 * Formato: Bearer <token>
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);

  if (!authHeader?.startsWith('Bearer ') || !token) {
    return res.status(401).json({ success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu-secret-key');
    req.user = decoded;
    next();
  } catch (_err) {
    return res.status(401).json({ success: false });
  }
};

module.exports = { authenticate };
