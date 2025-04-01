import { useEffect, useMemo, useState } from "react";
import { usePets } from "@/hooks/usePets";
import { fetchAnimalTypes } from "@/api/animalTypes";
import { AnimalType } from "@/api/animalTypes";
import { FilterBar } from "@/components/FilterBar";
import { PetGrid } from "@/components/PetGrid";
import { fetchPetCount } from "@/api/pets";
import { PetFilters } from "@/api/pets";

export default function Home() {
  const [filters, setFilters] = useState<PetFilters>({
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
  const [perPage, setPerPage] = useState(10);
  const [totalPets, setTotalPets] = useState(0);
  
  const offset = (page - 1) * perPage;
  const totalPages = Math.ceil(totalPets / perPage);
  
  // Memoize filters + pagination for stable reference
  const memoizedFilters = useMemo(
    () => ({ ...filters, limit: perPage, offset }),
    [filters, perPage, offset]
  );

  // Reset to page 1 when filters/perPage change
  useEffect(() => setPage(1), [filters, perPage]);

  // Fetch total pet count when filters change (without pagination)
  useEffect(() => {
    const { limit, offset, ...filterOnly } = memoizedFilters;
    fetchPetCount(filterOnly)
      .then(setTotalPets)
      .catch((err) => console.error("Pet count error:", err));
  }, [memoizedFilters]);

  // Fetch filtered pets
  const { pets, loading, error } = usePets(memoizedFilters);

  const startIndex = offset + 1;
  const endIndex = Math.min(offset + pets.length, totalPets);

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
      {!loading && <PetGrid pets={pets} /> }
      <div className="px-4 pt-4">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    
    {/* Left: Showing text */}
    <div className="text-sm text-muted-foreground">
      {totalPets > 0 && (
        <span>
          Showing {startIndex}–{endIndex} of {totalPets} pets
        </span>
      )}
    </div>

    {/* Right: Pagination + Per Page */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
      
      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-2 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm whitespace-nowrap">
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-2 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Per-page selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="perPage" className="text-sm whitespace-nowrap">
          Pets per page:
        </label>
        <input
          id="perPage"
          type="number"
          min={1}
          max={50}
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  </div>
</div>


    </div>
  );
}
