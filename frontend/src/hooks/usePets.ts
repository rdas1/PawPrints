import { useState, useEffect } from "react";
import { Pet } from "@/types";
import { fetchPets, PetFilters } from "@/api/pets";

export function usePets(filters: PetFilters) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const fetched = await fetchPets(filters);
      setPets(fetched);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [filters]);

  return { pets, loading, error, refetch };
}
