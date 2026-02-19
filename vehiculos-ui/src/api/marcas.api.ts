import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Marca = { id: number; nombre: string };

export async function listMarcasApi() {
  const { data } = await http.get<Paginated<Marca>>("/api/marcas/");
  return data; // { count, next, previous, results }
}

export async function createMarcaApi(nombre: string) {
  const { data } = await http.post<Marca>("/api/marcas/", { nombre });
  return data;
}

export async function updateMarcaApi(id: number, nombre: string) {
  const { data } = await http.put<Marca>(`/api/marcas/${id}/`, { nombre });
  return data;
}

export async function deleteMarcaApi(id: number) {
  await http.delete(`/api/marcas/${id}/`);
}