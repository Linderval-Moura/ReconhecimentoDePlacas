import { useState } from 'react';
import axios from 'axios';

function CadastroPlaca() {
  const [cidade, setCidade] = useState('');
  const [imagem, setImagem] = useState(null);

  const handleCidadeChange = (e) => {
    setCidade(e.target.value);
  };

  const handleImagemChange = (e) => {
    setImagem(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('cidade', cidade);
    formData.append('imagem', imagem);

    try {
      const response = await axios.post('http://localhost:3001/cadastroPlaca', formData);

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
      <form onSubmit={handleSubmit} action="/cadastroPlaca" method="POST" enctype="multipart/form-data">        
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
          name="file"
          accept="image/png"
          onChange={handleImagemChange}
        />
        <br />
        <div>
        <button type="submit">Cadastrar Placa</button>
        </div>
        <br />
      </form>
    </div>
  );
}

export default CadastroPlaca;
