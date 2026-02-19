import { http } from "./http";
    
// CAMBIO: Paginated es el mismo tipo genérico
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// CAMBIO: Show reemplaza Marca (ahora es función de cine)
export type Show = {
  id: number;
  // CAMBIO: movie_title es el nombre de la película
  movie_title: string;
  // CAMBIO: room es la sala de cine
  room: string;
  // CAMBIO: price es el precio de entrada
  price: number;
  // CAMBIO: available_seats son los asientos disponibles
  available_seats: number;
  // CAMBIO: created_at es la fecha de creación
  created_at?: string;
};

// CAMBIO: Función para listar funciones públicamente
export async function listShowsPublicApi() {
  const { data } = await http.get<Paginated<Show>>("/api/shows/");
  return data; // { count, next, previous, results }
}

// CAMBIO: Función para listar funciones en admin
export async function listShowsAdminApi() {
  const { data } = await http.get<Paginated<Show>>("/api/shows/");
  return data;
}

// CAMBIO: Crear nueva función de cine
export async function createShowApi(payload: Omit<Show, "id" | "created_at">) {
  const { data } = await http.post<Show>("/api/shows/", payload);
  return data;
}

// CAMBIO: Actualizar función existente
export async function updateShowApi(id: number, payload: Partial<Show>) {
  const { data } = await http.put<Show>(`/api/shows/${id}/`, payload);
  return data;
}

// CAMBIO: Eliminar función
export async function deleteShowApi(id: number) {
  await http.delete(`/api/shows/${id}/`);
}
