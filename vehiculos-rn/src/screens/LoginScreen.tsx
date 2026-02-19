import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { loginApi } from "../api/auth.api";
import type { RootStackParamList } from "../../App";

type Nav = NativeStackNavigationProp<RootStackParamList, "Login">;

type GlobalAuthStore = { accessToken?: string; refreshToken?: string };

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [errorMessage, setErrorMessage] = useState("");

  const doLogin = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const tokenPair = await loginApi(username.trim(), password);

      const store = global as unknown as GlobalAuthStore;
      store.accessToken = tokenPair.access;
      store.refreshToken = tokenPair.refresh;

      navigation.replace("Home");
    } catch {
      setErrorMessage("Login falló. Revisa credenciales / backend / baseURL.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login (JWT)</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Usuario</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="admin"
        placeholderTextColor="#8b949e"
        style={styles.input}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="admin"
        placeholderTextColor="#8b949e"
        style={styles.input}
        secureTextEntry
      />

      <Pressable onPress={doLogin} style={styles.btn}>
        <Text style={styles.btnText}>Ingresar</Text>
      </Pressable>

      <Text style={styles.note}>
        Se guarda accessToken en memoria global (para el interceptor axios).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16, justifyContent: "center" },
  title: { color: "#58a6ff", fontSize: 24, fontWeight: "800", marginBottom: 12 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
  },
  btn: {
    marginTop: 14,
    backgroundColor: "#21262d",
    borderColor: "#58a6ff",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  note: { color: "#8b949e", marginTop: 10, fontSize: 12 },
});