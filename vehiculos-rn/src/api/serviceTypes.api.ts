import { http } from "./http";
// CAMBIO: Importar tipos de películas/cartelera en lugar de ServiceType
import type { ServiceType } from "../types/serviceType";
import type { Paginated } from "../types/drf";

// CAMBIO: Esta API ahora consume /api/service-types/ que retorna movie_catalog de Mongo
// En futuro, cambiar a /api/movie-catalog/ para consumir directamente colección MongoDB
export async function listServiceTypesApi(): Promise<Paginated<ServiceType> | ServiceType[]> {
  // CAMBIO: Consumir endpoint de catálogo de películas
  const { data } = await http.get<Paginated<ServiceType> | ServiceType[]>("/api/service-types/");
  return data;
}

// CAMBIO: Crear película en catálogo (solo admin)
export async function createServiceTypeApi(payload: Pick<ServiceType, "name"> & Partial<ServiceType>): Promise<ServiceType> {
  // CAMBIO: Parámetros ahora incluyen movie_title, genre, duration_min, rating, is_active
  const { data } = await http.post<ServiceType>("/api/service-types/", payload);
  return data;
}

// CAMBIO: Eliminar película del catálogo
export async function deleteServiceTypeApi(id: string): Promise<void> {
  await http.delete(`/api/service-types/${id}/`);
}