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
    sortOrder: ""
  });

  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);

  useEffect(() => {
    fetchAnimalTypes().then(setAnimalTypes).catch(console.error);
  }, []);

  const [page, setPage] = useState(1);
  const limit = 6;
  const offset = (page - 1) * limit;

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
      <div className="flex justify-center gap-4 py-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={pets.length < limit}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
