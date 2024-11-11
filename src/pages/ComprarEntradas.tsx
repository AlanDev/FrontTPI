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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, AlertCircle } from "lucide-react";
import api from "../services/api";

export default function ComprarEntradas() {
  const [peliculas, setPeliculas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState("");
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [cantidadEntradas, setCantidadEntradas] = useState(1);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [total, setTotal] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState(null);

  const precioEntrada = 10;

  useEffect(() => {
    const cargarPeliculas = async () => {
      try {
        const response = await api.get("/peliculas");
        setPeliculas(response.data);
      } catch (error) {
        console.error("Error al cargar las películas:", error);
      }
    };

    const cargarHorarios = async () => {
      try {
        const response = await api.get("/horarios");
        setHorarios(response.data);
      } catch (error) {
        console.error("Error al cargar los horarios:", error);
      }
    };

    cargarPeliculas();
    cargarHorarios();
  }, []);

  useEffect(() => {
    setTotal(cantidadEntradas * precioEntrada);
  }, [cantidadEntradas]);

  const handleCompra = async () => {
    try {
      // Primero creamos el objeto compraData
      const compraData = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        cantidadEntradas: parseInt(cantidadEntradas),
        pelicula: {
          id: parseInt(peliculaSeleccionada),
        },
        horario: {
          id: parseInt(horarioSeleccionado),
        },
        total: parseFloat(total),
      };

      console.log("Enviando datos de compra:", compraData);
      const response = await api.post("/clientes", compraData);

      if (response.status === 200) {
        const peliculaData = peliculas.find(
          (p) => p.id.toString() === peliculaSeleccionada
        );
        const horarioData = horarios.find(
          (h) => h.id.toString() === horarioSeleccionado
        );

        // Datos para el email
        const emailData = {
          email: email.trim(),
          nombreCliente: `${nombre.trim()} ${apellido.trim()}`,
          pelicula: peliculaData.titulo,
          sala: `Sala ${horarioData.id}`,
          fecha: new Date().toLocaleDateString("es-ES"),
          hora: horarioData.hora,
          cantidadEntradas: parseInt(cantidadEntradas),
          total: parseFloat(total),
        };

        console.log("Enviando datos de email:", emailData);

        try {
          const emailResponse = await api.post(
            "/email/send-confirmation",
            emailData
          );
          console.log("Respuesta del servidor email:", emailResponse);

          setConfirmationDetails({
            pelicula: peliculaData.titulo,
            cantidad: cantidadEntradas,
            total: total,
            email: email,
          });
          setShowConfirmation(true);

          // Limpiar formulario
          setNombre("");
          setApellido("");
          setEmail("");
          setTelefono("");
          setCantidadEntradas(1);
          setPeliculaSeleccionada("");
          setHorarioSeleccionado("");
        } catch (emailError) {
          console.error("Error al enviar el correo:", emailError);
          setConfirmationDetails({
            error: true,
            message: `Error al enviar el correo: ${
              emailError.response?.data || emailError.message
            }`,
          });
          setShowConfirmation(true);
        }
      }
    } catch (error) {
      console.error("Error en la compra:", error);
      setConfirmationDetails({
        error: true,
        message: `Error al procesar la compra: ${
          error.response?.data || error.message
        }`,
      });
      setShowConfirmation(true);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Comprar Entradas
        </h1>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Selecciona tu película y horario</CardTitle>
            <CardDescription>
              Elige la película, el horario, la cantidad de entradas y
              proporciona tus datos personales.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Tu apellido"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Tu teléfono"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pelicula">Película</Label>
              <Select
                onValueChange={setPeliculaSeleccionada}
                value={peliculaSeleccionada}
              >
                <SelectTrigger id="pelicula">
                  <SelectValue placeholder="Selecciona una película" />
                </SelectTrigger>
                <SelectContent>
                  {peliculas.map((pelicula) => (
                    <SelectItem
                      key={pelicula.id}
                      value={pelicula.id.toString()}
                    >
                      {pelicula.titulo} ({pelicula.duracion} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="horario">Horario</Label>
              <Select
                onValueChange={setHorarioSeleccionado}
                value={horarioSeleccionado}
              >
                <SelectTrigger id="horario">
                  <SelectValue placeholder="Selecciona un horario" />
                </SelectTrigger>
                <SelectContent>
                  {horarios.map((horario) => (
                    <SelectItem key={horario.id} value={horario.id.toString()}>
                      {horario.hora} - Sala: {horario.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cantidad">Cantidad de entradas</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                max="10"
                value={cantidadEntradas}
                onChange={(e) => setCantidadEntradas(parseInt(e.target.value))}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2">
                Resumen de tu compra
              </h3>
              <p>
                Nombre: {nombre} {apellido}
              </p>
              <p>Email: {email}</p>
              <p>Teléfono: {telefono}</p>
              <p>
                Película:{" "}
                {peliculas.find((p) => p.id.toString() === peliculaSeleccionada)
                  ?.titulo || "No seleccionada"}
              </p>
              <p>
                Horario:{" "}
                {horarios.find((h) => h.id.toString() === horarioSeleccionado)
                  ?.hora || "No seleccionado"}{" "}
                - Sala:{" "}
                {horarios.find((h) => h.id.toString() === horarioSeleccionado)
                  ?.id || ""}
              </p>
              <p>Cantidad de entradas: {cantidadEntradas}</p>
              <p className="font-bold">Total: €{total}</p>
            </div>
            <Button
              className="w-full"
              onClick={handleCompra}
              disabled={
                !nombre ||
                !apellido ||
                !email ||
                !peliculaSeleccionada ||
                !horarioSeleccionado ||
                cantidadEntradas < 1
              }
            >
              Confirmar Compra
            </Button>
          </CardFooter>
        </Card>

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {confirmationDetails?.error
                  ? "Error en la Compra"
                  : "¡Compra Realizada con Éxito!"}
              </DialogTitle>
            </DialogHeader>
            {confirmationDetails?.error ? (
              <>
                <div className="flex items-center justify-center text-red-500 mb-4">
                  <AlertCircle size={48} />
                </div>
                <DialogDescription>
                  {confirmationDetails.message}
                </DialogDescription>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center text-green-500 mb-4">
                  <CheckCircle size={48} />
                </div>
                <DialogDescription>
                  <p className="mb-2">Detalles de la compra:</p>
                  <ul className="list-disc list-inside mb-4">
                    <li>Película: {confirmationDetails?.pelicula}</li>
                    <li>Cantidad: {confirmationDetails?.cantidad} entradas</li>
                    <li>Total: €{confirmationDetails?.total}</li>
                  </ul>
                  <p>
                    Se ha enviado un correo con los detalles a:{" "}
                    {confirmationDetails?.email}
                  </p>
                </DialogDescription>
              </>
            )}
            <DialogFooter>
              <Button onClick={() => setShowConfirmation(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
