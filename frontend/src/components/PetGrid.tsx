import { Pet } from "@/types";
import { PetCard } from "./PetCard";

interface PetGridProps {
  pets: Pet[];
  onCardClick: (pet: Pet) => void;
  onDelete: (id: number) => void;
}

export function PetGrid({ pets, onCardClick, onDelete }: PetGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} onClick={() => onCardClick(pet)} onDelete={onDelete} />
      ))}
    </div>
  );
}