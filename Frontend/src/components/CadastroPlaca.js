import React, { useState } from 'react';
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
      const response = await axios.post('/cadastroPlaca', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Placa cadastrada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao cadastrar placa:', error);
    }
  };

  return (
    <div>
      <h2>Cadastro de Placa</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cidade:</label>
          <input
            type="text"
            value={cidade}
            onChange={handleCidadeChange}
            required
          />
        </div>
        <div>
          <label>Imagem (PNG):</label>
          <input
            type="file"
            accept=".png"
            onChange={handleImagemChange}
            required
          />
        </div>
        <div>
          <button type="submit">Cadastrar Placa</button>
        </div>
      </form>
    </div>
  );
}

export default CadastroPlaca;
