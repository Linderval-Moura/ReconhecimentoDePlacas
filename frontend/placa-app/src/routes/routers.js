import { Route, Routes } from "react-router-dom";
import Cadastro from "../components/CadastroPlaca.js";
import ConsultaPlaca from "../components/ConsultaPlaca.js";
import RelatorioPlaca from "../components/RelatorioPlaca.js";


export const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Cadastro />} />
      <Route path="/consulta" element={<ConsultaPlaca />} />
      <Route path="/relatorio" element={<RelatorioPlaca />} />
    </Routes>
  );
};