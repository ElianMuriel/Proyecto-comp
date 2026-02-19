import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// CAMBIO: Importar Show y funciones de shows en lugar de Marca
import { type Show, listShowsAdminApi, createShowApi, updateShowApi, deleteShowApi } from "../api/shows.api";

export default function AdminMarcasPage() {
  // CAMBIO: items tipo Show (funciones de cine)
  const [items, setItems] = useState<Show[]>([]);
  // CAMBIO: Campos para Show
  const [movieTitle, setMovieTitle] = useState("");
  const [room, setRoom] = useState("");
  const [price, setPrice] = useState("0");
  const [availableSeats, setAvailableSeats] = useState("0");
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      // CAMBIO: Usar listShowsAdminApi en lugar de listMarcasApi
      const data = await listShowsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar funciones. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      // CAMBIO: Validar campos de Show
      if (!movieTitle.trim()) return setError("Nombre de película requerido");
      if (!room.trim()) return setError("Sala requerida");
      if (parseFloat(price) <= 0) return setError("Precio debe ser mayor a 0");
      if (parseInt(availableSeats) <= 0) return setError("Asientos disponibles deben ser mayor a 0");

      // CAMBIO: Crear objeto Show
      const payload = {
        movie_title: movieTitle.trim(),
        room: room.trim(),
        price: parseFloat(price),
        available_seats: parseInt(availableSeats)
      };

      if (editId) await updateShowApi(editId, payload);
      else await createShowApi(payload);

      // CAMBIO: Limpiar campos de Show
      setMovieTitle("");
      setRoom("");
      setPrice("0");
      setAvailableSeats("0");
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar función. ¿Token admin?");
    }
  };

  const startEdit = (show: Show) => {
    setEditId(show.id);
    setMovieTitle(show.movie_title);
    setRoom(show.room);
    setPrice(show.price.toString());
    setAvailableSeats(show.available_seats.toString());
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteShowApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar función. ¿Reservas asociadas? ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* CAMBIO: Título de "Admin Marcas" a "Admin Funciones de Cine" */}
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Funciones de Cine (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* CAMBIO: Formulario con campos de Show (movie_title, room, price, available_seats) */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField 
            label="Nombre película" 
            value={movieTitle} 
            onChange={(e) => setMovieTitle(e.target.value)} 
            fullWidth 
          />
          <TextField 
            label="Sala" 
            value={room} 
            onChange={(e) => setRoom(e.target.value)} 
            fullWidth 
          />
          <TextField 
            label="Precio" 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            fullWidth 
          />
          <TextField 
            label="Asientos" 
            type="number" 
            value={availableSeats} 
            onChange={(e) => setAvailableSeats(e.target.value)} 
            fullWidth 
          />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          {/* CAMBIO: Limpiar campos de Show */}
          <Button 
            variant="outlined" 
            onClick={() => { 
              setMovieTitle(""); 
              setRoom(""); 
              setPrice("0"); 
              setAvailableSeats("0");
              setEditId(null); 
            }}
          >
            Limpiar
          </Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        {/* CAMBIO: Tabla con columnas de Show */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {/* CAMBIO: Columnas de Show */}
              <TableCell>Película</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Asientos</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* CAMBIO: Iterar sobre Shows (funciones) */}
            {items.map((show) => (
              <TableRow key={show.id}>
                <TableCell>{show.id}</TableCell>
                <TableCell>{show.movie_title}</TableCell>
                <TableCell>{show.room}</TableCell>
                <TableCell>${show.price.toFixed(2)}</TableCell>
                <TableCell>{show.available_seats}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(show)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(show.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}