import { useEffect, useState } from "react";
import { fetchPets } from "@/api/pets";
import { Pet } from "@/types";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPets()
      .then(setPets)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { pets, loading, error };
}
