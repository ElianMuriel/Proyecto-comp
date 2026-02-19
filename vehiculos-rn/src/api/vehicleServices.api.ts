import { http } from "./http";
// CAMBIO: Importar tipos de eventos de reserva en lugar de VehicleService
import type { VehicleService } from "../types/vehicleService";
import type { Paginated } from "../types/drf";

// CAMBIO: Esta API ahora consume /api/vehicle-services/ que retorna reservation_events de Mongo
// En futuro, cambiar a /api/reservation-events/ para consumir directamente colección MongoDB
export type ReservationEventCreatePayload = {
  // CAMBIO: reservation_id es ID de la reserva (de PostgreSQL)
  reservation_id: number;
  // CAMBIO: event_type es el tipo de evento (CREATED, CONFIRMED, CANCELLED, CHECKED_IN)
  event_type: string;
  // CAMBIO: source indica origen (WEB, MOBILE, SYSTEM)
  source?: string;
  // CAMBIO: note es una descripción del evento
  note?: string;
};

// CAMBIO: Función para listar eventos de reserva (desde Mongo)
export async function listVehicleServicesApi(): Promise<Paginated<VehicleService> | VehicleService[]> {
  // CAMBIO: Consumir endpoint de eventos de reserva (fue vehicle-services, ahora para events)
  const { data } = await http.get<Paginated<VehicleService> | VehicleService[]>("/api/vehicle-services/");
  return data;
}

// CAMBIO: Crear evento de reserva (solo para eventos del sistema)
export async function createVehicleServiceApi(payload: ReservationEventCreatePayload): Promise<VehicleService> {
  // CAMBIO: Parámetros ahora incluyen reservation_id, event_type, source, note
  const { data } = await http.post<VehicleService>("/api/vehicle-services/", payload);
  return data;
}

// CAMBIO: Eliminar evento de reserva
export async function deleteVehicleServiceApi(id: string): Promise<void> {
  await http.delete(`/api/vehicle-services/${id}/`);
}