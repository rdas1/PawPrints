import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPet, updatePet, deletePet } from "@/api/pets";
import { Pet } from "@/types";
import { createAnimalType, fetchAnimalTypes } from "@/api/animalTypes";
import { AnimalType } from "@/api/animalTypes";
import CreatableSelect from "react-select/creatable";
import { SingleValue } from "react-select";

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState<Pet | null>(null);
  const [form, setForm] = useState<Partial<Pet & { animal_type_id: number | null }>>({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);

  useEffect(() => {
    fetchAnimalTypes().then(setAnimalTypes).catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchPet(Number(id))
      .then((data) => {
        setPet(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (pet && animalTypes.length > 0) {
      const matching = animalTypes.find((t) => t.name === pet.animal_type);
      setForm({
        ...pet,
        animal_type_id: matching?.id ?? null,
      });
    }
  }, [pet, animalTypes]);

  const animalTypeOptions = animalTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  const selectedAnimalType = animalTypeOptions.find(
    (opt) => opt.value === form.animal_type_id
  ) ?? null;

  const handleUpdate = async () => {
    if (!id) return;

    const { name, status, priority, animal_type_id } = form;

    if (!name || !status || !priority || !animal_type_id) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      await updatePet(Number(id), {
        name,
        status,
        priority,
        // animal_type_id,
      });

      const refreshed = await fetchPet(Number(id));
      setPet(refreshed);
      setEditing(false);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm("Are you sure you want to delete this pet?");
    if (!confirm) return;
    try {
      await deletePet(Number(id));
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!pet) return <div className="p-4">Pet not found.</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">
        {editing ? "Edit Pet" : pet.name}
      </h1>

      {editing ? (
        <div className="space-y-3">
          <input
            className="w-full border px-2 py-1 rounded"
            value={form.name || ""}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <select
            className="w-full border px-2 py-1 rounded"
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as "Available for Adoption" | "Adopted" | "In Care",
              }))
            }
          >
            <option value="Available for Adoption">Available for Adoption</option>
            <option value="In Care">In Care</option>
            <option value="Adopted">Adopted</option>
          </select>
          <select
            className="w-full border px-2 py-1 rounded"
            value={form.priority}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                priority: e.target.value as "Low" | "Medium" | "High",
              }))
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <div className="rounded border p-1">
            <CreatableSelect
              isClearable
              placeholder="Select or create animal type..."
              options={animalTypeOptions}
              value={selectedAnimalType}
              onChange={(
                newValue: SingleValue<{ value: number; label: string }> | null,
                // actionMeta: ActionMeta<{ value: number; label: string }>
              ) => {
                if (!newValue) {
                  setForm((f) => ({ ...f, animal_type_id: undefined }));
                } else {
                  setForm((f) => ({ ...f, animal_type_id: newValue.value }));
                }
              }}
              onCreateOption={async (inputValue) => {
                try {
                  const newType = await createAnimalType(inputValue.trim());
                  setAnimalTypes((prev) => [...prev, newType]);
                  setForm((f) => ({ ...f, animal_type_id: newType.id }));
                } catch (err) {
                  alert("Failed to create new animal type.");
                }
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <p><strong>Status:</strong> {pet.status}</p>
          <p><strong>Priority:</strong> {pet.priority}</p>
          <p><strong>Animal Type:</strong> {pet.animal_type}</p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setEditing(true)}
              className="border px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}