import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import CreatableSelect from "react-select/creatable";
  import { AnimalType, createAnimalType } from "@/api/animalTypes";
  import { Pet } from "@/types";
  import { useEffect, useMemo, useState } from "react";
  
  type Props = {
    open: boolean;
    onClose: () => void;
    pet: Pet;
    animalTypes: AnimalType[];
    onSave: (updated: Partial<Pet>) => void;
  };
  
  export function PetDetailModal({
    open,
    onClose,
    pet,
    animalTypes,
    onSave,
  }: Props) {
    const [localAnimalTypes, setLocalAnimalTypes] =
      useState<AnimalType[]>(animalTypes);
    const [form, setForm] = useState<
      Partial<Pet & { animal_type_id: number | null }>
    >({});
    const [isDirty, setIsDirty] = useState(false);
  
    // Keep localAnimalTypes in sync
    useEffect(() => {
      setLocalAnimalTypes(animalTypes);
    }, [animalTypes]);
  
    // Initialize form when modal opens
    useEffect(() => {
      if (!pet) return;
  
      const match = animalTypes.find((t) => t.name === pet.animal_type);
      setForm({
        ...pet,
        animal_type_id: match?.id ?? null,
      });
      setIsDirty(false);
    }, [open, pet, animalTypes]);
  
    // React Select expects { value, label }
    const animalTypeOptions = useMemo(() => {
      return localAnimalTypes.map((type) => ({
        value: type.id,
        label: type.name,
      }));
    }, [localAnimalTypes]);
  
    const selectedAnimalType = useMemo(() => {
      const id = form.animal_type_id;
      if (!id) return null;
  
      const match = localAnimalTypes.find((t) => t.id === id);
      return match ? { value: match.id, label: match.name } : null;
    }, [form.animal_type_id, localAnimalTypes]);
  
    const handleChange = (
      field: keyof typeof form,
      value: string | number | null
    ) => {
      setForm((prev) => {
        const updated = { ...prev, [field]: value };
        setIsDirty(true);
        return updated;
      });
    };
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className="w-full max-w-lg"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 50,
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit {pet.name}</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-3 pt-2">
            <Input
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Pet name"
            />
  
            <select
              className="w-full border rounded px-2 py-1"
              value={form.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="">Select status</option>
              <option value="Available">Available</option>
              <option value="In Care">In Care</option>
              <option value="Adopted">Adopted</option>
            </select>
  
            <select
              className="w-full border rounded px-2 py-1"
              value={form.priority || ""}
              onChange={(e) => handleChange("priority", e.target.value)}
            >
              <option value="">Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
  
            <div className="rounded border p-1">
              <CreatableSelect
                placeholder="Animal type"
                isClearable
                options={animalTypeOptions}
                value={selectedAnimalType}
                onChange={(newValue) =>
                  handleChange("animal_type_id", newValue?.value ?? null)
                }
                onCreateOption={async (inputValue) => {
                  try {
                    const newType = await createAnimalType(inputValue.trim());
                    setLocalAnimalTypes((prev) => [...prev, newType]);
  
                    // 🔥 Immediate state update
                    setForm((prev) => ({
                      ...prev,
                      animal_type_id: newType.id,
                    }));
                    setIsDirty(true);
                  } catch (err) {
                    alert("Could not create animal type.");
                    console.error(err);
                  }
                }}
              />
            </div>
  
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={!isDirty}
                onClick={() => onSave(form)}
                className="bg-blue-600 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  