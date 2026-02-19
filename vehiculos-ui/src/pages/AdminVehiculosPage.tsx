import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// CAMBIO: Importar Show (para el dropdown) y Reservation (datos principales)
import { type Show, listShowsAdminApi } from "../api/shows.api";
import { type Reservation, listReservationsAdminApi, createReservationApi, updateReservationApi, deleteReservationApi } from "../api/vehiculos.api";

export default function AdminVehiculosPage() {
  // CAMBIO: items tipo Reservation (reservas de cine)
  const [items, setItems] = useState<Reservation[]>([]);
  // CAMBIO: shows tipo Show[] para dropdown de funciones
  const [shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState("");

  // CAMBIO: Campos para Reservation
  const [editId, setEditId] = useState<number | null>(null);
  const [show, setShow] = useState<number>(0);
  const [customerName, setCustomerName] = useState("");
  const [seats, setSeats] = useState(1);
  // CAMBIO: Status es nuevo (RESERVED, CONFIRMED, CANCELLED)
  const [status, setStatus] = useState<"RESERVED" | "CONFIRMED" | "CANCELLED">("RESERVED");

  const load = async () => {
    try {
      setError("");
      // CAMBIO: Usar listReservationsAdminApi en lugar de listVehiculosAdminApi
      const data = await listReservationsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar reservas. ¿Login? ¿Token admin?");
    }
  };

  // CAMBIO: loadShows reemplaza loadMarcas (cargar funciones disponibles)
  const loadShows = async () => {
    try {
      const data = await listShowsAdminApi();
      setShows(data.results); // DRF paginado
      if (!show && data.results.length > 0) setShow(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadShows(); }, []);

  const save = async () => {
    try {
      setError("");
      // CAMBIO: Validar campos de Reservation
      if (!show) return setError("Seleccione una función");
      if (!customerName.trim()) return setError("Nombre del cliente es requerido");
      if (seats <= 0) return setError("Asientos deben ser mayor a 0");

      // CAMBIO: Crear objeto Reservation
      const payload = {
        show: Number(show),
        customer_name: customerName.trim(),
        seats: Number(seats),
        status: status
      };

      if (editId) await updateReservationApi(editId, payload);
      else await createReservationApi(payload);

      // CAMBIO: Limpiar campos de Reservation
      setEditId(null);
      setCustomerName("");
      setSeats(1);
      setStatus("RESERVED");
      await load();
    } catch {
      setError("No se pudo guardar reserva. ¿Token admin?");
    }
  };

  // CAMBIO: startEdit maneja Reservation
  const startEdit = (r: Reservation) => {
    setEditId(r.id);
    setShow(r.show);
    setCustomerName(r.customer_name);
    setSeats(r.seats);
    setStatus(r.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteReservationApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar reserva. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* CAMBIO: Título de "Admin Vehículos" a "Admin Reservas" */}
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Reservas de Cine (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            {/* CAMBIO: Select de Shows en lugar de Marcas */}
            <FormControl sx={{ width: 260 }}>
              <InputLabel id="show-label">Función</InputLabel>
              <Select
                labelId="show-label"
                label="Función"
                value={show}
                onChange={(e) => setShow(Number(e.target.value))}
              >
                {shows.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.movie_title} - Sala {s.room} (#{s.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* CAMBIO: Nombre del cliente en lugar de Modelo */}
            <TextField 
              label="Nombre Cliente" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
              fullWidth 
            />
            {/* CAMBIO: Cantidad de asientos en lugar de Año */}
            <TextField 
              label="Asientos" 
              type="number" 
              value={seats} 
              onChange={(e) => setSeats(Number(e.target.value))} 
              sx={{ width: 160 }} 
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {/* CAMBIO: Status (estado de reserva) en lugar de Placa */}
            <FormControl sx={{ width: 220 }}>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                label="Estado"
                value={status}
                onChange={(e) => setStatus(e.target.value as "RESERVED" | "CONFIRMED" | "CANCELLED")}
              >
                <MenuItem value="RESERVED">Reservado</MenuItem>
                <MenuItem value="CONFIRMED">Confirmado</MenuItem>
                <MenuItem value="CANCELLED">Cancelado</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            {/* CAMBIO: Limpiar campos de Reservation */}
            <Button 
              variant="outlined" 
              onClick={() => { 
                setEditId(null); 
                setCustomerName(""); 
                setSeats(1); 
                setStatus("RESERVED");
              }}
            >
              Limpiar
            </Button>
            <Button variant="outlined" onClick={() => { load(); loadShows(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        {/* CAMBIO: Tabla con columnas de Reservation */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {/* CAMBIO: Columnas de Reservation */}
              <TableCell>Función</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Asientos</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* CAMBIO: Iterar sobre Reservations */}
            {items.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.show_movie_title ?? r.show}</TableCell>
                <TableCell>{r.customer_name}</TableCell>
                <TableCell>{r.seats}</TableCell>
                {/* CAMBIO: Mostrar status con badge de color */}
                <TableCell>
                  <span style={{
                    backgroundColor: r.status === "CONFIRMED" ? "#4caf50" : r.status === "CANCELLED" ? "#f44336" : "#2196f3",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}>
                    {r.status}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(r)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(r.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}