import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function RegistroVentas() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const PRECIO_ENTRADA = 10; // Precio de cada entrada en euros

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get("/clientes");
        console.log("Datos recibidos:", response.data); // Para debugging
        const clientesConIngresos = response.data.map((cliente) => ({
          ...cliente,
          ingresos: cliente.cantidadEntradas * PRECIO_ENTRADA,
        }));
        setClientes(clientesConIngresos);
        setFilteredClientes(clientesConIngresos);
        calcularIngresoTotal(clientesConIngresos);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
        if (error.response) {
          console.error("Respuesta del servidor:", error.response.data);
          console.error("Status:", error.response.status);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const calcularIngresoTotal = (clientesData) => {
    const total = clientesData.reduce(
      (acc, cliente) => acc + cliente.ingresos,
      0
    );
    setTotalRevenue(total);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filtered = clientes.filter((cliente) =>
      Object.values(cliente).some((value) => {
        if (typeof value === "object" && value !== null) {
          return Object.values(value).some(
            (nestedValue) =>
              nestedValue &&
              nestedValue.toString().toLowerCase().includes(searchTerm)
          );
        }
        return value && value.toString().toLowerCase().includes(searchTerm);
      })
    );

    setFilteredClientes(filtered);
    calcularIngresoTotal(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando clientes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Registro de Ventas de Entradas</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumen de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            Total: €{totalRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Basado en {filteredClientes.length} ventas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Últimas Ventas
            {searchTerm && ` (${filteredClientes.length} resultados)`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClientes.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha de Compra</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Cantidad Entradas</TableHead>
                    <TableHead>Nombre de la Película</TableHead>
                    <TableHead>Ingresos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        {cliente.createdAt
                          ? new Date(cliente.createdAt).toLocaleString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>{cliente.email}</TableCell>
                      <TableCell>{cliente.nombre}</TableCell>
                      <TableCell>{cliente.apellido}</TableCell>
                      <TableCell>{cliente.telefono}</TableCell>
                      <TableCell>{cliente.cantidadEntradas}</TableCell>
                      <TableCell>{cliente.pelicula?.titulo}</TableCell>
                      <TableCell>€{cliente.ingresos.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              {searchTerm ? (
                <p>No se encontraron resultados para "{searchTerm}"</p>
              ) : (
                <p>No hay clientes registrados</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
