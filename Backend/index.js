require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const moment = require('moment');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const cors = require('cors');

const app = express();

const allowedOrigins = ['https://reconhecimento-de-placas.vercel.app', 
                        'https://reconhecimento-de-placas.vercel.app/consulta', 
                        'https://reconhecimento-de-placas.vercel.app/relatorio'];

const corsOptions = {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));

// Conexão com o MongoDB
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Base de dados conectada!');
    app.emit('pronto');
  })
  .catch(e => console.log(e)
);

// Configuração do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar o multer para lidar com uploads de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const { parseISO, format } = require('date-fns'); 

const PlacaSchema = new mongoose.Schema({
  numeroPlaca: String,
  cidade: String,
  dataHora: String,
});

const Placa = mongoose.model('Placa', PlacaSchema);

// // Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "src/public")));

// Rota para a página HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Rota para o upload da imagem
app.post('/cadastroPlaca', upload.single('file'), async (req, res) => {
  try {
    const { cidade, dataHora } = req.body;
    const imagemPath = req.file.path;
  
    // Usar Tesseract.js para reconhecimento de caracteres na imagem
    const { data: { text } } = await Tesseract.recognize(imagemPath, "por");

    // Remover espaços em branco e caracteres de nova linha do número da placa
    const numeroPlacaLimpo = text.replace(/\s+/g, '');

    // const dataAtualFormatada = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    // Criar um registro no banco de dados
    const novaPlaca = new Placa({
      numeroPlaca: numeroPlacaLimpo,
      cidade,
      dataHora: dataHora,
    });

    await novaPlaca.save();

    res.status(200).json({ message: 'Placa cadastrada com sucesso', novaPlaca });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao processar a placa' });
  }
});

//Rota para retornar em PDF os dados de uma cidade passada em parametro , tente testar com "juazeiro" como parametro
app.get('/relatorio/cidade/:cidade', async (req, res) => {
  try {
    const cidade = req.params.cidade;

    // Consulto o banco de dados para obter registros com a cidade especificada
    const registros = await Placa.find({ cidade: cidade });

    // Crie um novo documento PDF
    const doc = new PDFDocument();

    // Define o nome do arquivo PDF gerado
    const pdfFileName = `relatorio_${cidade}_${format(new Date(), 'yyyyMMddHHmmss')}.pdf`;

    // Define os cabeçalhos HTTP para fazer o navegador baixar o PDF
    res.setHeader('Content-type', 'application/pdf');
    res.setHeader('Content-disposition', `attachment; filename=${pdfFileName}`);

    // Cria o PDF com as informações dos registros
    doc.pipe(res);

    doc.fontSize(16).text(`Relatório de Registros - Cidade: ${cidade}`, { align: 'center' });

    registros.forEach((registro) => {
      doc.fontSize(12).text(`Número da Placa: ${registro.numeroPlaca}`);
      doc.fontSize(12).text(`Cidade: ${registro.cidade}`);
      const dataHoraFormatada = format(parseISO(registro.dataHora), "dd/MM/yyyy HH:mm:ss");
      doc.fontSize(12).text(`Data e Hora: ${dataHoraFormatada}`);
      doc.moveDown(0.5);
    });

    // Finaliza o pdf
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao gerar o relatório' });
  }
});

//Rota para consultar placas
app.get('/consulta/:placa', async (req, res) => {
  try {
    const { placa } = req.params;

    // Consulta o banco de dados para verificar se a placa existe
    const registro = await Placa.findOne({ numeroPlaca: placa });

    if (registro) {
      // Se a placa existe, retorna um JSON com uma mensagem de sucesso
      res.status(200).json({ message: 'Placa encontrada no banco de dados' });
    } else {
      // Se a placa não existe, retorna um JSON com uma mensagem de erro
      res.status(404).json({ message: 'Placa não encontrada no banco de dados' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao consultar a placa' });
  }
});

// Rotas
app.on('pronto', () => {
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
  });
});