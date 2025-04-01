import { Pet } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface PetFilters {
  name?: string;
  status?: string;
  animal_type_id?: number | "";
  priority?: string;
  sortBy?: "name" | "priority" | "";
  sortOrder?: "asc" | "desc" | "";
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

export async function fetchPetCount(filters: PetFilters = {}): Promise<number> {
  const query = buildQuery(filters);
  const res = await fetch(`${BASE_URL}/pets/count?${query}`);
  if (!res.ok) throw new Error("Failed to fetch pet count");
  const data = await res.json();
  return data.total;
}

export async function fetchPet(id: number): Promise<Pet> {
  const res = await fetch(`${BASE_URL}/pets/${id}`);
  if (!res.ok) throw new Error("Failed to fetch pet");
  return res.json();
}

export async function updatePet(id: number, data: Partial<Pet>): Promise<Pet> {
  const res = await fetch(`${BASE_URL}/pets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update pet");
  return res.json();
}

export async function deletePet(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/pets/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete pet");
}

