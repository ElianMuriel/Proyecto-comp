export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export function toArray<T>(data: Paginated<T> | T[]): T[] {
  // Soporta backend que responde paginado (DRF) o directo (array)
  return Array.isArray(data) ? data : data.results;
}