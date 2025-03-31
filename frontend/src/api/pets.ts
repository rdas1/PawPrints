import { Pet } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchPets(): Promise<Pet[]> {
  const res = await fetch(`${BASE_URL}/pets`);
  if (!res.ok) throw new Error("Failed to fetch pets");
  return res.json();
}