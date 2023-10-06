import React, { useState } from 'react';
import axios from 'axios';

function ConsultarPlaca() {
  const [placa, setPlaca] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handlePlacaChange = (e) => {
    setPlaca(e.target.value);
  };

  const consultarPlaca = async () => {

    const consultaUrl = `https://reconhecimentoodeplacas.onrender.com/consulta/${placa}`;
    console.log('URL da solicitação:', consultaUrl);

    try {
      const response = await axios.get(consultaUrl);

      if (response.status === 200) {
        alert('Placa encontrada no banco de dados');
      } else if (response.status === 404) {
        alert('Placa não encontrada no banco de dados');
      }
    } catch (error) {
      console.error('Erro ao consultar placa:', error);
    }
  };

  return (
    <div>
      <h2>Consultar Placa</h2>
      <div>
        <label>Placa:</label>
        <input
          type="text"
          value={placa}
          onChange={handlePlacaChange}
          required
        />
      </div>
      <div>
        <button onClick={consultarPlaca}>Consultar Placa</button>
      </div>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default ConsultarPlaca;
