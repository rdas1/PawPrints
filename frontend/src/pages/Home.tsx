import { useEffect, useState } from "react";
import { usePets } from "@/hooks/usePets";
import { fetchAnimalTypes } from "@/api/animalTypes";
import { AnimalType } from "@/api/animalTypes";
import { FilterBar } from "@/components/FilterBar";
import { PetGrid } from "@/components/PetGrid";

export default function Home() {
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    priority: "",
    animal_type_id: "",
    sortBy: "",
    sortOrder: "asc"
  });

  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);

  useEffect(() => {
    fetchAnimalTypes().then(setAnimalTypes).catch(console.error);
  }, []);

  const { pets, loading, error } = usePets(filters);

  return (
    <div>
      <h1 className="text-2xl font-semibold p-4">Available Pets</h1>
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        animalTypes={animalTypes}
      />
      {loading && <p className="p-4">Loading...</p>}
      {error && <p className="p-4 text-red-600">Error: {error}</p>}
      {!loading && <PetGrid pets={pets} />}
    </div>
  );
}
