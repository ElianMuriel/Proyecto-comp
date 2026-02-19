import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listVehiculosApi } from "../api/vehiculos.api";
import { listServiceTypesApi } from "../api/serviceTypes.api";
import { listVehicleServicesApi, createVehicleServiceApi, deleteVehicleServiceApi } from "../api/vehicleServices.api";

import type { Vehiculo } from "../types/vehiculo";
import type { ServiceType } from "../types/serviceType";
import type { VehicleService } from "../types/vehicleService";
import { toArray } from "../types/drf";


function serviceTypeLabel(st: ServiceType): string {
  return st.name;
}

function parseOptionalNumber(input: string): { value?: number; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) return { value: undefined };
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) return { error: "Cost debe ser numérico" };
  return { value: parsed };
}

export default function VehicleServicesScreen() {
  const [services, setServices] = useState<VehicleService[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

  const [selectedVehiculoId, setSelectedVehiculoId] = useState<number | null>(null);
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState<string>("");

  const [notes, setNotes] = useState("");
  const [costInput, setCostInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const vehiculoById = useMemo(() => {
    const map = new Map<number, Vehiculo>();
    vehiculos.forEach((v) => map.set(v.id, v));
    return map;
  }, [vehiculos]);

  const serviceTypeById = useMemo(() => {
    const map = new Map<string, ServiceType>();
    serviceTypes.forEach((s) => map.set(s.id, s));
    return map;
  }, [serviceTypes]);

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const [servicesData, vehiculosData, serviceTypesData] = await Promise.all([
        listVehicleServicesApi(),
        listVehiculosApi(),
        listServiceTypesApi(),
      ]);

      const servicesList = toArray(servicesData);
      const vehiculosList = toArray(vehiculosData);
      const serviceTypesList = toArray(serviceTypesData);

      setServices(servicesList);
      setVehiculos(vehiculosList);
      setServiceTypes(serviceTypesList);

      if (selectedVehiculoId === null && vehiculosList.length) setSelectedVehiculoId(vehiculosList[0].id);
      if (!selectedServiceTypeId && serviceTypesList.length) setSelectedServiceTypeId(serviceTypesList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar info. ¿Token? ¿baseURL? ¿backend encendido?");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createService = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (selectedVehiculoId === null) return setErrorMessage("Seleccione un vehículo");
      if (!selectedServiceTypeId) return setErrorMessage("Seleccione un tipo de servicio");

      const trimmedNotes = notes.trim() ? notes.trim() : undefined;
      const { value: parsedCost, error } = parseOptionalNumber(costInput);
      if (error) return setErrorMessage(error);

      // NO enviar fecha, backend la toma actual
      const created = await createVehicleServiceApi({
        vehiculo_id: selectedVehiculoId,
        service_type_id: selectedServiceTypeId,
        notes: trimmedNotes,
        cost: parsedCost,
      });

      setServices((prev) => [created, ...prev]);
      setNotes("");
      setCostInput("");
    } catch {
      setErrorMessage("No se pudo crear vehicle service");
    }
  };

  const removeService = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteVehicleServiceApi(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar vehicle service");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Services</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Vehículo (placa — dueño si existe)</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedVehiculoId ?? ""}
          onValueChange={(value) => setSelectedVehiculoId(Number(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {vehiculos.map((v) => (
            <Picker.Item key={v.id} label={v.placa} value={v.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Tipo de servicio</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedServiceTypeId}
          onValueChange={(value) => setSelectedServiceTypeId(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {serviceTypes.map((st) => (
            <Picker.Item key={st.id} label={serviceTypeLabel(st)} value={st.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Notas (opcional)</Text>
      <TextInput
        placeholder="Notas"
        placeholderTextColor="#8b949e"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
      />

      <Text style={styles.label}>Costo (opcional)</Text>
      <TextInput
        placeholder="40"
        placeholderTextColor="#8b949e"
        value={costInput}
        onChangeText={setCostInput}
        keyboardType="numeric"
        style={styles.input}
      />

      <Pressable onPress={createService} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Crear (sin enviar fecha)</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const v = vehiculoById.get(item.vehiculo_id);
          const st = serviceTypeById.get(item.service_type_id);

          const line1 = v ? v.placa : `vehiculo_id: ${item.vehiculo_id}`;
          const line2 = st ? st.name : `service_type_id: ${item.service_type_id}`;

          const extras: string[] = [];
          if (item.cost !== undefined) extras.push(`Costo: ${item.cost}`);
          if (item.notes) extras.push(`Notas: ${item.notes}`);
          if (item.date) extras.push(`Fecha: ${item.date}`);

          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText} numberOfLines={1}>{line1}</Text>
                <Text style={styles.rowSub} numberOfLines={1}>{line2}</Text>
                {extras.map((t, idx) => (
                  <Text key={idx} style={styles.rowSub} numberOfLines={1}>{t}</Text>
                ))}
              </View>

              <Pressable onPress={() => removeService(item.id)}>
                <Text style={styles.del}>Eliminar</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },

  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },

  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },

  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },

  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "800" },
});