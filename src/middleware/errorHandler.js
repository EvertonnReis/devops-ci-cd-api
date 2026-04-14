// Middleware centralizado de tratamento de erros
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  console.error('Erro:', {
    message,
    statusCode,
    timestamp: new Date().toISOString()
  });

  const response = {
    success: false,
    error: message,
    statusCode,
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { errorHandler };
