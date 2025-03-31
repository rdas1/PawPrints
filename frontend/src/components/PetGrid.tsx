import { Pet } from "@/types";
import { PetCard } from "./PetCard";

interface PetGridProps {
  pets: Pet[];
}

export function PetGrid({ pets }: PetGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
}
