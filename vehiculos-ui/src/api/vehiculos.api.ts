import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Vehiculo = {
  id: number;
  marca: number;
  marca_nombre?: string;
  modelo: string;
  anio: number;
  placa: string;
  color?: string;
  creado_en?: string;
};

export async function listVehiculosPublicApi() {
  const { data } = await http.get<Paginated<Vehiculo>>("/api/vehiculos/");
  return data; // { ... , results: [] }
}

export async function listVehiculosAdminApi() {
  const { data } = await http.get<Paginated<Vehiculo>>("/api/vehiculos/");
  return data;
}

export async function createVehiculoApi(payload: Omit<Vehiculo, "id">) {
  const { data } = await http.post<Vehiculo>("/api/vehiculos/", payload);
  return data;
}

export async function updateVehiculoApi(id: number, payload: Partial<Vehiculo>) {
  const { data } = await http.put<Vehiculo>(`/api/vehiculos/${id}/`, payload);
  return data;
}

export async function deleteVehiculoApi(id: number) {
  await http.delete(`/api/vehiculos/${id}/`);
}