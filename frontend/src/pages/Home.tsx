import { usePets } from "@/hooks/usePets";
import { PetGrid } from "@/components/PetGrid";

export default function Home() {
  const { pets, loading, error } = usePets();

  if (loading) return <p className="p-4">Loading pets...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold p-4">Available Pets</h1>
      <PetGrid pets={pets} />
    </div>
  );
}
