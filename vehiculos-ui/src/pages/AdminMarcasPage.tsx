import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Marca, listMarcasApi, createMarcaApi, updateMarcaApi, deleteMarcaApi } from "../api/marcas.api";

export default function AdminMarcasPage() {
  const [items, setItems] = useState<Marca[]>([]);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listMarcasApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar marcas. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!nombre.trim()) return setError("Nombre requerido");

      if (editId) await updateMarcaApi(editId, nombre.trim());
      else await createMarcaApi(nombre.trim());

      setNombre("");
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar marca. ¿Token admin?");
    }
  };

  const startEdit = (m: Marca) => {
    setEditId(m.id);
    setNombre(m.nombre);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteMarcaApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar marca. ¿Vehículos asociados? ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Marcas (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Nombre marca" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setNombre(""); setEditId(null); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.nombre}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(m)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(m.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}