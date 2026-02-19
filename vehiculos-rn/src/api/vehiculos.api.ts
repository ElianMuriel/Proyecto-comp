import { http } from "./http";
import type { Paginated } from "../types/drf";
// CAMBIO: Importar tipo Vehiculo (pero ahora usaremos para Shows/Funciones de cine)
import type { Vehiculo } from "../types/vehiculo";

// CAMBIO: Esta función ahora lista funciones de cine (shows) en lugar de vehículos
// El tipo Vehiculo se reutiliza pero en contexto de funciones
export async function listVehiculosApi(): Promise<Paginated<Vehiculo> | Vehiculo[]> {
  // CAMBIO: Consumir endpoint de funciones (shows) disponibles
  const { data } = await http.get<Paginated<Vehiculo> | Vehiculo[]>("/api/shows/");
  return data;
}