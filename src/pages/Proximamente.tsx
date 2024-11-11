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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star } from "lucide-react";
import api from "../services/api";

export default function Proximamente() {
  const [peliculas, setPeliculas] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("fechaEstreno");
  const [filterGenre, setFilterGenre] = useState("todos");

  useEffect(() => {
    // Cargar las películas desde la API
    const cargarPeliculas = async () => {
      try {
        const response = await api.get("/proximamente");
        setPeliculas(response.data);
      } catch (error) {
        console.error("Error al cargar las películas:", error);
      }
    };
    cargarPeliculas();
  }, []);

  const generos = ["todos", ...new Set(peliculas.map((p) => p.genero))];

  const peliculasFiltradas = peliculas
    .filter((p) => filterGenre === "todos" || p.genero === filterGenre)
    .sort((a, b) => {
      if (sortBy === "fechaEstreno")
        return (
          new Date(a.fechaEstreno).getTime() -
          new Date(b.fechaEstreno).getTime()
        );
      if (sortBy === "titulo") return a.titulo.localeCompare(b.titulo);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Próximamente en Cine Byte
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <Select onValueChange={setFilterGenre} defaultValue={filterGenre}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por género" />
            </SelectTrigger>
            <SelectContent>
              {generos.map((genero) => (
                <SelectItem key={genero} value={genero}>
                  {genero.charAt(0).toUpperCase() + genero.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSortBy} defaultValue={sortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fechaEstreno">Fecha de Estreno</SelectItem>
              <SelectItem value="titulo">Título</SelectItem>
              <SelectItem value="rating">Calificación</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {peliculasFiltradas.map((pelicula) => (
            <Card key={pelicula.id} className="flex flex-col">
              <CardHeader>
                <img
                  src="../../public/imagen.webp"
                  alt={pelicula.titulo}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle>{pelicula.titulo}</CardTitle>
                <CardDescription>{pelicula.genero}</CardDescription>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="secondary">{pelicula.clasificacion}</Badge>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {pelicula.duracion} min
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 stroke-yellow-400" />
                    {pelicula.calificacion
                      ? pelicula.calificacion.toFixed(1)
                      : "N/A"}
                  </span>
                </div>
                <div className="mt-4 flex items-center text-primary">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Estreno: {formatDate(pelicula.fechaEstreno)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Recordar Estreno</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
