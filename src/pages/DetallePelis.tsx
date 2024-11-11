"use client";

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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Clock, Calendar } from "lucide-react";
import api from "../services/api";
import { useParams } from "react-router-dom";

export default function DetallePelicula() {
  const { id } = useParams(); // Captura el ID de la película desde la URL

  const [funcionSeleccionada, setFuncionSeleccionada] = useState("");
  const [pelicula, setPelicula] = useState(null); // Datos de la película seleccionada
  const [funciones, setFunciones] = useState([]); // Funciones disponibles para la película

  useEffect(() => {
    const cargarPelicula = async () => {
      try {
        const response = await api.get(`peliculas/${id}`); // Usa el ID capturado para cargar la película
        setPelicula(response.data);
        setFunciones(response.data.funciones || []);
      } catch (error) {
        console.error("Error al cargar la película:", error);
      }
    };
    cargarPelicula();
  }, [id]);

  if (!pelicula) return <p>Cargando...</p>; // Muestra un mensaje mientras se cargan los datos

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img
              src="../../public/imagen.webp"
              alt={`Poster de ${pelicula.titulo}`}
              className="w-full rounded-lg shadow-lg mb-4"
            />
            <div className="space-y-2">
              <Badge>{pelicula.clasificacion}</Badge>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{pelicula.duracion} minutos</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                <span>{pelicula.calificacion?.toFixed(1)}/5</span>
              </div>
            </div>
          </div>

          {/* Columna derecha: Detalles de la película y funciones */}
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{pelicula.titulo}</h1>
            <p className="text-xl mb-4">{pelicula.genero}</p>
            <h2 className="text-2xl font-semibold mb-2">Sinopsis</h2>
            <p className="mb-4">{pelicula.sinopsis}</p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">Tráiler</h2>
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <video
                src="../../public/trailer.mp4"
                autoPlay
                loop
                muted
                alt={`Tráiler de ${pelicula.titulo}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Comprar Entradas</CardTitle>
                <CardDescription>
                  Selecciona la función que prefieras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  onValueChange={setFuncionSeleccionada}
                  value={funcionSeleccionada}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una función" />
                  </SelectTrigger>
                  <SelectContent>
                    {funciones.map((funcion) => (
                      <SelectItem
                        key={funcion.id}
                        value={funcion.id.toString()}
                      >
                        {new Date(funcion.fecha).toLocaleDateString()} -{" "}
                        {funcion.hora} - {funcion.sala}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={!funcionSeleccionada}>
                  Comprar Entradas
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
