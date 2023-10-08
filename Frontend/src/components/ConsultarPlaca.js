import React, { useState } from 'react';
import axios from 'axios';

function ConsultarPlaca() {
  const [placa, setPlaca] = useState('');

  const handlePlacaChange = (e) => {
    setPlaca(e.target.value);
  };

  const consultarPlaca = async () => {

    try {
      const response = await axios.get(`https://reconhecimentodeplacas.onrender.com/consulta/${placa}`);

      console.log('URL da solicitação:', response.data);

      if (response.status === 200) {
        alert('Placa encontrada no banco de dados');
      };
      if (!response.status === 200) {
        alert('Placa não encontrada no banco de dados');
      };
    } catch (error) {
      console.error('Erro ao consultar placa:', error);
      alert('Erro ao consultar a placa');
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
    </div>
  );
}

export default ConsultarPlaca;
