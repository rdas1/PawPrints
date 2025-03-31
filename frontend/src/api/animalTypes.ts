export interface AnimalType {
    id: number;
    name: string;
}
  
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchAnimalTypes(): Promise<AnimalType[]> {
    const res = await fetch(`${BASE_URL}/animal-types`);
    if (!res.ok) throw new Error("Failed to fetch animal types");
    return res.json();
}