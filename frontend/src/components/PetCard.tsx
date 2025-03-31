import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pet } from "@/types";

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{pet.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{pet.animal_type}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span>Status: {pet.status}</span>
          <span>Priority: {pet.priority}</span>
        </div>
      </CardContent>
    </Card>
  );
}
