import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PacientesPage from "./pages/PacientesPage";
import MedicosPage from "./pages/MedicosPage";
import TurnosPage from "./pages/TurnosPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/turnos" element={<TurnosPage />} />
        <Route path="/pacientes" element={<PacientesPage />} />
        <Route path="/medicos" element={<MedicosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

