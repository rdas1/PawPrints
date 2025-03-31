import { useState } from "react";
import { usePets } from "@/hooks/usePets";
import { FilterBar } from "@/components/FilterBar";
import { PetGrid } from "@/components/PetGrid";

export default function Home() {
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    priority: ""
  });

  const { pets, loading, error } = usePets(filters);

  return (
    <div>
      <h1 className="text-2xl font-semibold p-4">Available Pets</h1>
      <FilterBar filters={filters} setFilters={setFilters} />
      {loading && <p className="p-4">Loading...</p>}
      {error && <p className="p-4 text-red-600">Error: {error}</p>}
      {!loading && <PetGrid pets={pets} />}
    </div>
  );
}
