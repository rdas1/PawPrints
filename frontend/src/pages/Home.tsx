import { useEffect, useMemo, useState } from "react";
import { usePets } from "@/hooks/usePets";
import { fetchAnimalTypes } from "@/api/animalTypes";
import { AnimalType } from "@/api/animalTypes";
import { FilterBar } from "@/components/FilterBar";
import { PetGrid } from "@/components/PetGrid";
import { fetchPet, fetchPetCount, updatePet, deletePet, createPet } from "@/api/pets";
import { PetFilters } from "@/api/pets";
import { Pet } from "@/types";
import { PetDetailModal } from "@/components/PetDetailModal";
import { CreatePetModal } from "@/components/CreatePetModal";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SleepyFooter from "@/components/SleepyFooter";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [filters, setFilters] = useState<PetFilters>({
    name: "", status: "", priority: "", animal_type_id: "", sortBy: "", sortOrder: ""
  });

  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const [page, setPage] = useState(1);
  const [perPageInput, setPerPageInput] = useState("12");
  const [perPage, setPerPage] = useState(12);
  const [totalPets, setTotalPets] = useState(0);
  const offset = (page - 1) * perPage;
  const totalPages = Math.ceil(totalPets / perPage);

  const memoizedFilters = useMemo(() => ({ ...filters, limit: perPage, offset }), [filters, perPage, offset]);

  useEffect(() => {
    fetchAnimalTypes().then(setAnimalTypes).catch(console.error);
  }, []);

  useEffect(() => setPage(1), [filters, perPage]);

  useEffect(() => {
    const { limit, offset, ...filterOnly } = memoizedFilters;
    fetchPetCount(filterOnly).then(setTotalPets).catch(console.error);
  }, [memoizedFilters]);

  const { pets, loading, error } = usePets(memoizedFilters);

  // Show splash screen for minimum of 1s
  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const startIndex = offset + 1;
  const endIndex = Math.min(offset + pets.length, totalPets);
  const refreshPetList = () => setFilters((f) => ({ ...f }));

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#294F4F] z-50 flex flex-col items-center justify-center transition-opacity duration-700">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      {/* Filter Bar & Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
        <FilterBar filters={filters} setFilters={setFilters} animalTypes={animalTypes} />
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#D67272] text-white hover:bg-[#c55c5c] px-4 py-2 rounded text-md font-semibold font-display self-start md:self-auto"
        >
          Add Pet
        </button>
      </div>

      {error && <p className="p-4 text-red-600">Error: {error}</p>}

      <PetGrid
        pets={pets}
        onCardClick={async (pet) => {
          const fresh = await fetchPet(pet.id);
          setSelectedPet(fresh);
        }}
        onDelete={async (id) => {
          try {
            await deletePet(id);
            refreshPetList();
            setSelectedPet(null);
          } catch (err) {
            alert("Failed to delete pet.");
            console.error(err);
          }
        }}
      />

      {/* Pagination */}
      <div className="px-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-white">
            {totalPets > 0 && <span>Showing {startIndex}–{endIndex} of {totalPets} pets</span>}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="bg-white text-black">Previous</Button>
              <span className="text-sm text-white">Page {page} of {totalPages || 1}</span>
              <Button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="bg-white text-black">Next</Button>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="perPage" className="text-sm text-white">Pets per page:</label>
              <input
                id="perPage"
                type="number"
                min={1}
                max={50}
                value={perPageInput}
                onChange={(e) => setPerPageInput(e.target.value)}
                onBlur={() => {
                  const parsed = parseInt(perPageInput, 10);
                  if (isNaN(parsed) || parsed < 1 || parsed > 50) {
                    setPerPageInput(perPage.toString());
                  }
                }}
                className="w-20 border rounded px-2 py-1 text-sm bg-white text-black"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedPet && (
        <PetDetailModal
          open={true}
          pet={selectedPet}
          animalTypes={animalTypes}
          onClose={() => setSelectedPet(null)}
          onSave={async (updated) => {
            await updatePet(selectedPet.id, updated);
            const updatedTypes = await fetchAnimalTypes();
            setAnimalTypes(updatedTypes);
            const freshPet = await fetchPet(selectedPet.id);
            setSelectedPet(freshPet);
            refreshPetList();
            setTimeout(() => setSelectedPet(null), 0);
          }}
          onDelete={async (id) => {
            try {
              await deletePet(id);
              refreshPetList();
              setSelectedPet(null);
            } catch (err) {
              alert("Failed to delete pet.");
              console.error(err);
            }
          }}
        />
      )}

      {showCreateModal && (
        <CreatePetModal
          open={true}
          animalTypes={animalTypes}
          onClose={() => setShowCreateModal(false)}
          onCreate={async (created) => {
            setShowCreateModal(false);
            setFilters({ name: "", status: "", priority: "", animal_type_id: "", sortBy: "", sortOrder: "" });
            setPage(1);
            toast.success(`${created.name} added!`, {
              action: {
                label: "View Pet",
                onClick: () => setSelectedPet(created),
              },
              duration: 6000,
            });
            refreshPetList();
          }}
        />
      )}

      <SleepyFooter />
    </div>
  );
}
