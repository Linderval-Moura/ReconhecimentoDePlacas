import { useState, useEffect } from 'react';
import axios from 'axios';

function GerarRelatorio() {
  const [cidade, setCidade] = useState('');
  const [relatorio, setRelatorio] = useState(null);

  const handleCidadeChange = (e) => {
    setCidade(e.target.value);
  };

  const gerarRelatorio = async () => {
    try {
      const response = await axios.get(`/relatorio/cidade/${cidade}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  };

  return (
    <div>
      <h2>Gerar Relatório</h2>
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
        <button onClick={gerarRelatorio}>Gerar Relatório</button>
      </div>
    </div>
  );
}

export default GerarRelatorio;
