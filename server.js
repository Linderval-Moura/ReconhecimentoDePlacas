require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Configurar a conexão com o MongoDB
// mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Base de dados conectada!');
//     app.emit('pronto');
//   })
//   .catch(e => console.log(e));

// Configuração do Express
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Rotas
// app.on('pronto', () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
  });
// });