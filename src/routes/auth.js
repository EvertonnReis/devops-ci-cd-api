const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { email, password, name }
 * Response: { success, message, data: { user, token } }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Response: { success, message, data: { user, token } }
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Headers: Authorization: Bearer <token>
 * Response: { success, message, data: { user } }
 * Middleware authenticate valida o token JWT
 */
router.get('/me', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dados do usuário obtidos com sucesso',
    data: {
      user: req.user
    }
  });
});

module.exports = router;
