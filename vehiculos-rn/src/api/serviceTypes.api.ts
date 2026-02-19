import { http } from "./http";
import type { ServiceType } from "../types/serviceType";
import type { Paginated } from "../types/drf";

export async function listServiceTypesApi(): Promise<Paginated<ServiceType> | ServiceType[]> {
  const { data } = await http.get<Paginated<ServiceType> | ServiceType[]>("/api/service-types/");
  return data;
}

export async function createServiceTypeApi(payload: Pick<ServiceType, "name"> & Partial<ServiceType>): Promise<ServiceType> {
  const { data } = await http.post<ServiceType>("/api/service-types/", payload);
  return data;
}

export async function deleteServiceTypeApi(id: string): Promise<void> {
  await http.delete(`/api/service-types/${id}/`);
}