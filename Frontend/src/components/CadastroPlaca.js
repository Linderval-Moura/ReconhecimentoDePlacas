import { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

function CadastroPlaca() {
  const [cidade, setCidade] = useState('');
  const [imagem, setImagem] = useState(null);

  const handleCidadeChange = (e) => {
    setCidade(e.target.value);
  };

  const handleImagemChange = (e) => {
    setImagem(e.target.files[0]);
  };

  const getCurrentDateTime = () => {
    const currentDateTime = new Date().toISOString();
    return currentDateTime;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('cidade', cidade);
    formData.append('file', imagem);

    formData.append('dataHora', getCurrentDateTime());

    try {
      const response = await axios.post('https://reconhecimentodeplacas.onrender.com/cadastroPlaca', formData);

      if (response.status === 200) {
        alert('Placa cadastrada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao cadastrar placa:', error);
    }
  };

  return (
    <div>
      <h1>Cadastro de Placa</h1>
      <form id ="placaForm" action="/cadastroPlaca" method="POST" enctype="multipart/form-data" onSubmit={handleSubmit}>        
        <label htmlFor="cidade">Cidade:</label>
        <input
          type="text"
          value={cidade}
          onChange={handleCidadeChange}
          required
        />
        <br />       
        <label htmlFor="imagem">Imagem (PNG):</label>
        <input
          type="file"
          name="imagem"
          accept=".png"
          onChange={handleImagemChange}
          required
        />
        <br />
        <input
          type="hidden"
          name="dataHora"
          value={getCurrentDateTime()}
        />
        <div>
        <button type="submit">Cadastrar Placa</button>
        </div>
        <br />
      </form>
      <div>
        <Link to={"/consulta"}>
          <button>Consultar Placas</button>
        </Link>

        <Link to={"/relatorio"}>
          <button>Relatorio Placas</button>
        </Link>
      </div>
    </div>
  );
}

export default CadastroPlaca;
