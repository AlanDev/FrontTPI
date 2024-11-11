import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Peliculas from "./components/Peliculas";
import Salas from "./components/Salas";
import Inicio from "./pages/Inicio";
import Cartelera from "./pages/Cartelera";
import Navbar from "./components/Navbar";
import Proximamente from "./pages/Proximamente";
import Promociones from "./pages/Promociones";
import ComprarEntradas from "./pages/ComprarEntradas";
import Clientes from "./pages/Clientes";
import DetallePelicula from "./pages/DetallePelis";

//import Funciones from "./components/Funciones";
//import Clientes from "./components/Clientes";
//import Reservas from "./components/Reservas";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/cartelera" element={<Cartelera />} />
        <Route path="/detallepelicula/:id" element={<DetallePelicula />} />
        <Route path="/proximamente" element={<Proximamente />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/comprarentradas" element={<ComprarEntradas />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </Router>
  );
}

export default App;
