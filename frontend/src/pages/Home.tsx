import { useEffect, useMemo, useState } from "react";
import { usePets } from "@/hooks/usePets";
import { fetchAnimalTypes } from "@/api/animalTypes";
import { AnimalType } from "@/api/animalTypes";
import { FilterBar } from "@/components/FilterBar";
import { PetGrid } from "@/components/PetGrid";
import { fetchPet, fetchPetCount, updatePet } from "@/api/pets";
import { PetFilters } from "@/api/pets";
import { Pet } from "@/types";
import { PetDetailModal } from "@/components/PetDetailModal";
import { CreatePetModal } from "@/components/CreatePetModal";
import { toast } from "sonner";
import { deletePet } from "@/api/pets";
import { Button } from "@/components/ui/button";

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
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  useEffect(() => {
    fetchAnimalTypes().then(setAnimalTypes).catch(console.error);
  }, []);

  const [page, setPage] = useState(1);
  const [perPageInput, setPerPageInput] = useState("12");
  const [perPage, setPerPage] = useState(12);
  const [totalPets, setTotalPets] = useState(0);
  const offset = (page - 1) * perPage;
  const totalPages = Math.ceil(totalPets / perPage);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const parsed = parseInt(perPageInput, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 50) {
        setPerPage(parsed);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [perPageInput]);

  const memoizedFilters = useMemo(
    () => ({ ...filters, limit: perPage, offset }),
    [filters, perPage, offset]
  );

  useEffect(() => setPage(1), [filters, perPage]);

  useEffect(() => {
    const { limit, offset, ...filterOnly } = memoizedFilters;
    fetchPetCount(filterOnly)
      .then(setTotalPets)
      .catch((err) => console.error("Pet count error:", err));
  }, [memoizedFilters]);

  const { pets, loading, error } = usePets(memoizedFilters);

  const startIndex = offset + 1;
  const endIndex = Math.min(offset + pets.length, totalPets);

  const refreshPetList = () => {
    setFilters((f) => ({ ...f })); // triggers re-fetch via dependency
  };

  const [showCreateModal, setShowCreateModal] = useState(false);

  // const handleViewPet = (pet: Pet) => {
  //   setFilters({
  //     name: "",
  //     status: "",
  //     priority: "",
  //     animal_type_id: "",
  //     sortBy: "",
  //     sortOrder: ""
  //   });
  //   setPage(1);
  //   setSelectedPet(pet);
  // };

  useEffect(() => {
    toast("Test toast");
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-2xl text-[#E8F1E5] font-semibold ">Available Pets</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#D67272] text-white hover:bg-[#c55c5c] px-4 py-2 rounded text-md cursor-pointer transition"
        >
          Add Pet
        </button>
      </div>
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        animalTypes={animalTypes}
      />
      {loading && <p className="p-4">Loading...</p>}
      {error && <p className="p-4 text-red-600">Error: {error}</p>}
      {!loading && (
        <PetGrid
          pets={pets}
          onCardClick={async (pet) => {
            const fresh = await fetchPet(pet.id);
            console.log("Fresh pet from API:", fresh); // 👈 check this!
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
      )}

      <div className="px-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-white">
            {totalPets > 0 && (
              <span>
                Showing {startIndex}–{endIndex} of {totalPets} pets
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-2 py-2 border rounded bg-white text-black hover:bg-gray-100 disabled:opacity-50 cursor-pointer transition"
              >
                Previous
              </Button>
              <span className="text-sm whitespace-nowrap">
                Page {page} of {totalPages || 1}
              </span>
              <Button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-2 py-2 border rounded bg-white text-black hover:bg-gray-100 disabled:opacity-50 cursor-pointer transition"
              >
                Next
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="perPage" className="text-sm whitespace-nowrap">
                Pets per page:
              </label>
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
      {selectedPet && (
        <PetDetailModal
          open={true}
          pet={selectedPet}
          animalTypes={animalTypes}
          onClose={() => setSelectedPet(null)}
          onSave={async (updated) => {
            await updatePet(selectedPet.id, updated);
          
            // 🔄 Fetch latest animal types
            const updatedTypes = await fetchAnimalTypes();
            setAnimalTypes(updatedTypes);
          
            // 🔄 Refresh pet data
            const freshPet = await fetchPet(selectedPet.id);
            setSelectedPet(freshPet);
          
            refreshPetList();
            setTimeout(() => setSelectedPet(null), 0); // close modal
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
            setFilters({
              name: "",
              status: "",
              priority: "",
              animal_type_id: "",
              sortBy: "",
              sortOrder: ""
            });
            setPage(1); // jump to beginning to help user see new pet
          
            console.log("Created pet:", created);
            
            // show toast
            toast('This is a toast');
            // toast.success(`${created.name} added!`, {
            //   action: {
            //     label: "View Pet",
            //     onClick: () => {
            //       setSelectedPet(created);
            //     }
            //   },
            //   duration: Infinity,
            // });
          
            refreshPetList();
          }}          
        />
      )}


    </div>
    
  );
}
