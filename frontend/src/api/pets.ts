import { Pet } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PetFilters {
  name?: string;
  status?: string;
  animal_type_id?: number;
  priority?: string;
  sortBy?: "name" | "priority";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

function buildQuery(params: PetFilters): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, value.toString());
    }
  });
  return query.toString();
}

export async function fetchPets(filters: PetFilters = {}): Promise<Pet[]> {
  const query = buildQuery(filters);
  const res = await fetch(`${BASE_URL}/pets?${query}`);
  if (!res.ok) throw new Error("Failed to fetch pets");
  return res.json();
}
