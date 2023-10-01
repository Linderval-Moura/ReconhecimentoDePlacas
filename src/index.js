require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const moment = require('moment');
const path = require('path');

const app = express();

// Configurar a conexão com o MongoDB
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
     console.log('Base de dados conectada!');
     app.emit('pronto');
   })
   .catch(e => console.log(e));

// Configuração do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const originalname = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}_${originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });


const PlacaSchema = new mongoose.Schema({
  numeroPlaca: String,
  cidade: String,
  dataHora: String,
});

const Placa = mongoose.model('Placa', PlacaSchema);

// Rota para a página HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Rota para o upload da imagem
app.post('/cadastroPlaca', upload.single('imagem'), async (req, res) => {
  try {
    const { cidade, dataHora } = req.body;
    const imagemPath = req.file.path;

    // Usar Tesseract.js para reconhecimento de caracteres na imagem
    const Tesseract = require('tesseract.js');
    const { data: { text } } = await Tesseract.recognize(imagemPath);

    // Criar um registro no banco de dados
    const novaPlaca = new Placa({
      numeroPlaca: text,
      cidade,
      dataHora,
    });

    await novaPlaca.save();

    res.status(200).json({ message: 'Placa cadastrada com sucesso', novaPlaca });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao processar a placa' });
  }
});

// Rotas
app.on('pronto', () => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
  });
});
