import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ticket, Popcorn, Users, Search } from "lucide-react";
import api from "../services/api";

export default function Promociones() {
  const [promociones, setPromociones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarPromociones();
  }, []);

  // Function to load promotions from the API
  const cargarPromociones = async () => {
    try {
      const response = await api.get("/promociones");
      console.log(response.data);
      setPromociones(response.data);
    } catch (error) {
      console.error("Error loading promotions:", error);
    }
  };

  const promocionesFiltradas = promociones.filter((promo) => {
    const tituloValido = promo.titulo && typeof promo.titulo === "string";
    const descripcionValida =
      promo.descripcion && typeof promo.descripcion === "string";

    return (
      (tituloValido &&
        promo.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (descripcionValida &&
        promo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Promociones Cine Byte
        </h1>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar promociones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promocionesFiltradas.map((promo) => (
            <Card key={promo.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">
                    {promo.nombre}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{promo.descripcion}</CardDescription>

                {/* Display promotion code if available */}
                {promo.codigoPromocion ? (
                  <div className="mt-4">
                    <Badge variant="outline" className="text-sm">
                      Código: {promo.codigoPromocion}
                    </Badge>
                  </div>
                ) : (
                  <div className="mt-4">
                    <Badge variant="outline" className="text-sm">
                      Código no disponible
                    </Badge>
                  </div>
                )}

                {promo.fechaVencimiento ? (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Válido hasta:{" "}
                    {new Date(promo.fechaVencimiento).toLocaleDateString(
                      "es-ES"
                    )}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Fecha de vencimiento no disponible
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full">Aplicar Promoción</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {promocionesFiltradas.length === 0 && (
          <p className="text-center text-lg mt-8">
            No se encontraron promociones que coincidan con tu búsqueda.
          </p>
        )}
      </main>
    </div>
  );
}
