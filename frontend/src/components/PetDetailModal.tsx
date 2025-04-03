import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import Select from "react-select";
  import CreatableSelect from "react-select/creatable";
  import { AnimalType, createAnimalType } from "@/api/animalTypes";
  import { Pet } from "@/types";
  import { useEffect, useMemo, useState } from "react";
  
  type Props = {
    open: boolean;
    onClose: () => void;
    pet: Pet | null;
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
    const [localAnimalTypes, setLocalAnimalTypes] = useState<AnimalType[]>(animalTypes);
    const [form, setForm] = useState<Partial<Pet & { animal_type_id: number | null }>>({});
    const [isDirty, setIsDirty] = useState(false);
  
    useEffect(() => {
      setLocalAnimalTypes(animalTypes);
    }, [animalTypes]);
  
    useEffect(() => {
      if (!open) return;
  
      if (!pet) {
        setForm({ name: "", status: "Available for Adoption", priority: "Medium", animal_type_id: null });
      } else {
        const match = animalTypes.find((t) => t.name === pet.animal_type);
        setForm({
          ...pet,
          animal_type_id: match?.id ?? null,
        });
      }
      setIsDirty(false);
    }, [open, pet, animalTypes]);
  
    const handleChange = (field: keyof typeof form, value: string | number | null) => {
      setForm((prev) => {
        const updated = { ...prev, [field]: value };
        setIsDirty(true);
        return updated;
      });
    };
  
    // Options
    const statusOptions = [
      { value: "Available", label: "Available" },
      { value: "In Care", label: "In Care" },
      { value: "Adopted", label: "Adopted" },
    ];
  
    const priorityOptions = [
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "High", label: "High" },
    ];
  
    const animalTypeOptions = useMemo(
      () =>
        localAnimalTypes.map((type) => ({
          value: type.id,
          label: type.name,
        })),
      [localAnimalTypes]
    );
  
    const selectedStatus = statusOptions.find((opt) => opt.value === form.status) ?? null;
    const selectedPriority = priorityOptions.find((opt) => opt.value === form.priority) ?? null;
    const selectedAnimalType = animalTypeOptions.find(
      (opt) => opt.value === form.animal_type_id
    ) ?? null;
  
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
            <DialogTitle>{pet ? `Edit ${pet.name}` : "Add New Pet"}</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={form.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Pet name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Animal Type</label>
              <CreatableSelect
                placeholder="Select or create animal type"
                isClearable
                options={animalTypeOptions}
                value={selectedAnimalType}
                onChange={(opt) => handleChange("animal_type_id", opt?.value ?? null)}
                onCreateOption={async (inputValue) => {
                  try {
                    const newType = await createAnimalType(inputValue.trim());
                    setLocalAnimalTypes((prev) => [...prev, newType]);
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
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "1px solid #d1d5db",
                    boxShadow: "none",
                  }),
                }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <Select
                placeholder="Select status"
                options={statusOptions}
                value={selectedStatus}
                onChange={(opt) => handleChange("status", opt?.value ?? "")}
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "1px solid #d1d5db",
                    boxShadow: "none",
                  }),
                }}
              />
            </div>
  
            <div className="space-y-1">
              <label className="text-sm font-medium">Priority</label>
              <Select
                placeholder="Select priority"
                options={priorityOptions}
                value={selectedPriority}
                onChange={(opt) => handleChange("priority", opt?.value ?? "")}
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "1px solid #d1d5db",
                    boxShadow: "none",
                  }),
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
  