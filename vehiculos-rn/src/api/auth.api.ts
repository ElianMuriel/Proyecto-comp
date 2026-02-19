import { http } from "./http";
import type { TokenPair } from "../types/auth";

export async function loginApi(username: string, password: string): Promise<TokenPair> {
  const { data } = await http.post<TokenPair>("/api/auth/login/", { username, password });
  return data;
}