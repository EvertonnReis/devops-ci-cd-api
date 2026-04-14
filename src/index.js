require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(requestLogger);

// Health check endpoint para Docker/Kubernetes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Rotas
app.use('/api/auth', authRoutes);

// Rota de teste de erro genérico (para cobertura do errorHandler)
if (process.env.NODE_ENV === 'test') {
  app.get('/test/error', (req, res, next) => {
    const err = new Error('Erro genérico sem statusCode');
    next(err);
  });

  app.get('/test/error-empty', (req, res, next) => {
    const err = new Error();
    // Erro sem message
    next(err);
  });
}

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de erro global
app.use(errorHandler);

// Iniciar servidor apenas se for o módulo principal
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} | Ambiente: ${NODE_ENV}`);
  });
}

module.exports = app;
