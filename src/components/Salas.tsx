import { useState, useEffect } from "react";
import api from "../services/api";

function Salas() {
  const [salas, setSalas] = useState([]);

  useEffect(() => {
    cargarSalas();
  }, []);

  const cargarSalas = async () => {
    try {
      const response = await api.get("/salas");
      setSalas(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Salas</h2>
      <ul>
        {salas.map((sala: any) => (
          <li key={sala.id}>
            Sala {sala.numero} - Capacidad: {sala.capacidad}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Salas;
