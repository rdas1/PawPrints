import { Pet } from "@/types";
import { Trash2 } from "lucide-react";

type Props = {
  pet: Pet;
  onClick: () => void;
  onDelete: (id: number) => void;
};

export function PetCard({ pet, onClick, onDelete }: Props) {
  return (
    <div
      className="relative rounded-lg bg-white text-black p-4 shadow cursor-pointer transition-all duration-200 hover:bg-midnight hover:text-white group"
      onClick={onClick}
    >
      {/* Delete icon, visible only on hover */}
      {onDelete && (
        <button
          className="absolute top-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
            const confirm = window.confirm(`Delete ${pet.name}?`);
            if (confirm) onDelete(pet.id);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div className="font-semibold text-lg">{pet.name}</div>
      <div className="text-sm text-gray-500 group-hover:text-gray-300">{pet.animal_type}</div>
      <div className="pt-2 text-sm">
        <div>Status: {pet.status}</div>
        <div>Priority: {pet.priority}</div>
      </div>
    </div>
  );
}
