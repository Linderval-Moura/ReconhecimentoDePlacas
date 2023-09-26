require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Configurar a conexão com o MongoDB
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectei à base de dados');
    app.emit('pronto');
  })
  .catch(e => console.log(e));

// Configuração do Express
app.use(express.json());

// Rotas
app.on('pronto', () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
  });
});