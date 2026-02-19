import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
// CAMBIO: PublicVehiclesPage → PublicShowsPage (mostrar funciones públicamente)
import PublicVehiclesPage from "./pages/PublicVehiclesPage";
import LoginPage from "./pages/LoginPage";

import AdminHomePage from "./pages/AdminHomePage";
// CAMBIO: AdminMarcasPage → AdminShowsPage (gestión de funciones)
import AdminMarcasPage from "./pages/AdminMarcasPage";
// CAMBIO: AdminVehiculosPage → AdminReservationsPage (gestión de reservas)
import AdminVehiculosPage from "./pages/AdminVehiculosPage";

import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          {/* CAMBIO: Cambiar título de "Vehículos UI" a "Cine UI" */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cine UI (MUI)
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/acerca">Acerca</Button>
            {/* CAMBIO: "/lista" ahora muestra funciones/películas */}
            <Button color="inherit" component={Link} to="/lista">Funciones</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/admin">Admin</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/acerca" element={<AboutPage />} />
        {/* CAMBIO: "/lista" ahora es lista de funciones (shows) */}
        <Route path="/lista" element={<PublicVehiclesPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminHomePage />
            </RequireAuth>
          }
        />

        {/* CAMBIO: "/admin/marcas" → "/admin/shows" (gestión de funciones de cine) */}
        <Route
          path="/admin/marcas"
          element={
            <RequireAuth>
              <AdminMarcasPage />
            </RequireAuth>
          }
        />

        {/* CAMBIO: "/admin/vehiculos" → "/admin/reservations" (gestión de reservas) */}
        <Route
          path="/admin/vehiculos"
          element={
            <RequireAuth>
              <AdminVehiculosPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}