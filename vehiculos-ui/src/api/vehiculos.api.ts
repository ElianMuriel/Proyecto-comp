import { http } from "./http";
    
// CAMBIO: Paginated es el mismo tipo genérico
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// CAMBIO: Reservation reemplaza Vehiculo (ahora es reserva de cine)
export type Reservation = {
  id: number;
  // CAMBIO: show es el ID de la función de cine
  show: number;
  // CAMBIO: show_movie_title es el nombre de la película (solo lectura)
  show_movie_title?: string;
  // CAMBIO: show_room es la sala (solo lectura)
  show_room?: string;
  // CAMBIO: customer_name es el nombre del cliente
  customer_name: string;
  // CAMBIO: seats es la cantidad de asientos reservados
  seats: number;
  // CAMBIO: status es el estado (RESERVED, CONFIRMED, CANCELLED)
  status: "RESERVED" | "CONFIRMED" | "CANCELLED";
  // CAMBIO: created_at es la fecha de creación
  created_at?: string;
};

// CAMBIO: Función para listar reservas públicamente
export async function listReservationsPublicApi() {
  const { data } = await http.get<Paginated<Reservation>>("/api/reservations/");
  return data; // { count, next, previous, results }
}

// CAMBIO: Función para listar reservas en admin
export async function listReservationsAdminApi() {
  const { data } = await http.get<Paginated<Reservation>>("/api/reservations/");
  return data;
}

// CAMBIO: Crear nueva reserva
export async function createReservationApi(payload: Omit<Reservation, "id" | "created_at" | "show_movie_title" | "show_room">) {
  const { data } = await http.post<Reservation>("/api/reservations/", payload);
  return data;
}

// CAMBIO: Actualizar reserva existente (cambiar estado, etc.)
export async function updateReservationApi(id: number, payload: Partial<Reservation>) {
  const { data } = await http.put<Reservation>(`/api/reservations/${id}/`, payload);
  return data;
}

// CAMBIO: Eliminar reserva
export async function deleteReservationApi(id: number) {
  await http.delete(`/api/reservations/${id}/`);
}