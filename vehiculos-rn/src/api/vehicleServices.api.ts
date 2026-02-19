import { http } from "./http";
import type { VehicleService } from "../types/vehicleService";
import type { Paginated } from "../types/drf";

export type VehicleServiceCreatePayload = {
  vehiculo_id: number;
  service_type_id: string;
  notes?: string;
  cost?: number;
};

export async function listVehicleServicesApi(): Promise<Paginated<VehicleService> | VehicleService[]> {
  const { data } = await http.get<Paginated<VehicleService> | VehicleService[]>("/api/vehicle-services/");
  return data;
}

export async function createVehicleServiceApi(payload: VehicleServiceCreatePayload): Promise<VehicleService> {
  const { data } = await http.post<VehicleService>("/api/vehicle-services/", payload);
  return data;
}

export async function deleteVehicleServiceApi(id: string): Promise<void> {
  await http.delete(`/api/vehicle-services/${id}/`);
}