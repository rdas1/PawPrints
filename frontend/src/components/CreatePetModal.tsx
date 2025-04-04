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
  import { createPet } from "@/api/pets"; // ✅ import your API method
  import { Pet } from "@/types";
  import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
  
  type Props = {
    open: boolean;
    onClose: () => void;
    animalTypes: AnimalType[];
    onCreate: (created: Pet) => void;
    onAnimalTypeCreated?: (newType: AnimalType) => void;
  };
  
  export function CreatePetModal({ open, onClose, animalTypes, onCreate, onAnimalTypeCreated }: Props) {
    const [localAnimalTypes, setLocalAnimalTypes] = useState<AnimalType[]>(animalTypes);
    const [form, setForm] = useState<Partial<Pet & { animal_type_id: number | null }>>({
      name: "",
      status: "Available for Adoption",
      priority: "Medium",
      animal_type_id: null,
    });
    const [isDirty, setIsDirty] = useState(false);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLocalAnimalTypes(animalTypes);
    }, [animalTypes]);
  
    const handleChange = (field: keyof typeof form, value: string | number | null) => {
      setForm((prev) => {
        const updated = { ...prev, [field]: value };
        setIsDirty(true);
        return updated;
      });
    };
  
    const statusOptions = [
      { value: "Available for Adoption", label: "Available for Adoption" },
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
  
    const handleCreate = async () => {
      if (!form.name || !form.status || !form.priority || !form.animal_type_id) {
        alert("Please fill out all fields.");
        return;
      }
  
      try {
        setLoading(true);
        const created = await createPet({
          name: form.name,
          status: form.status,
          priority: form.priority,
          animal_type_id: form.animal_type_id,
        });
        onCreate(created);
      } catch (err) {
        toast.error("Failed to create pet.");
        // alert("Failed to create pet.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const nameIsValid = (form.name?.trim() || "").length > 0;
    const animalTypeIsValid = form.animal_type_id != null;
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Pet</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={form.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Pet name"
              />
            {(form.name?.trim() === "" && isDirty) && (
                <p className="text-sm text-red-500">Name is required.</p>
            )}
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
                  
                      // update local dropdown
                      setLocalAnimalTypes((prev) => [...prev, newType]);
                  
                      // notify parent
                      onAnimalTypeCreated?.(newType);
                  
                      // select it
                      setForm((prev) => ({
                        ...prev,
                        animal_type_id: newType.id,
                      }));
                  
                      setIsDirty(true);
                    } catch (err) {
                        toast.error("Could not create animal type.");
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
              {(form.animal_type_id == null && isDirty) && (
                <p className="text-sm text-red-500">Animal type is required.</p>
            )}
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
                disabled={!isDirty || loading || !nameIsValid || !animalTypeIsValid}
                onClick={handleCreate}
                className="bg-blue-600 text-white"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  