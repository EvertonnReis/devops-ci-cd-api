const { register: registerService, login: loginService } = require('../services/authService');

/**
 * Controller para registro de novo usuário
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    const result = await registerService(email, password, name);
    
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller para login de usuário
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const result = await loginService(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login
};
