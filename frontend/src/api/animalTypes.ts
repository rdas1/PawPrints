import { BASE_URL } from "./config";

export interface AnimalType {
    id: number;
    name: string;
}
  
export async function fetchAnimalTypes(): Promise<AnimalType[]> {
    const res = await fetch(`${BASE_URL}/animal-types`);
    if (!res.ok) throw new Error("Failed to fetch animal types");
    return res.json();
}

export async function createAnimalType(name: string): Promise<AnimalType> {
    const res = await fetch(`${BASE_URL}/animal-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to create animal type");
    return res.json();
}
