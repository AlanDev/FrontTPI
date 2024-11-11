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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Film, Popcorn, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Inicio() {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculaDestacada, setPeliculaDestacada] = useState(null);

  useEffect(() => {
    cargarPeliculas();
  }, []);

  const cargarPeliculas = async () => {
    try {
      const response = await api.get("/peliculas");
      const peliculasData = response.data;
      setPeliculas(peliculasData);

      if (peliculasData.length > 0) {
        setPeliculaDestacada(peliculasData[0]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto py-8">
        <section className="mb-12">
          {peliculaDestacada && (
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img
                src="../../public/imagen.webp"
                alt={`Banner de ${peliculaDestacada.titulo}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Estreno: {peliculaDestacada.titulo}
                  </h2>
                  <Link to={`/detallepelicula/${peliculaDestacada.id}`}>
                    <Button>Ver mas</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">En Cartelera</h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {peliculas.map((pelicula, index) => (
                <CarouselItem
                  key={pelicula.id || index}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <Card>
                    <CardHeader>
                      <img
                        src="../../public/imagen.webp"
                        alt={pelicula.titulo}
                        className="w-full h-[300px] object-cover rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent>
                      <CardTitle>{pelicula.titulo}</CardTitle>
                      <CardDescription>{pelicula.descripcion}</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/detallepelicula/${pelicula.id}`}>
                        <Button className="w-full">Ver mas</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Promociones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>2x1 en Entradas</CardTitle>
                <CardDescription>Todos los martes y miércoles</CardDescription>
              </CardHeader>
              <CardContent>
                <Ticket className="w-12 h-12 mx-auto mb-4" />
                <p>
                  Disfruta del cine por menos. Trae a un amigo y paga solo una
                  entrada.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver detalles
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Combo Familiar</CardTitle>
                <CardDescription>Perfecto para toda la familia</CardDescription>
              </CardHeader>
              <CardContent>
                <Popcorn className="w-12 h-12 mx-auto mb-4" />
                <p>4 entradas + 2 palomitas grandes + 4 refrescos medianos</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver detalles
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Noche de Estrenos</CardTitle>
                <CardDescription>
                  Sé el primero en ver los nuevos lanzamientos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Film className="w-12 h-12 mx-auto mb-4" />
                <p>Acceso exclusivo a pre-estrenos y contenido especial</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver detalles
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Cine Byte. Todos los derechos reservados.</p>
          <div className="mt-4">
            <a href="#" className="hover:underline mx-2">
              Términos y Condiciones
            </a>
            <a href="#" className="hover:underline mx-2">
              Política de Privacidad
            </a>
            <a href="#" className="hover:underline mx-2">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
