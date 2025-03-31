import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface FilterBarProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

export function FilterBar({ filters, setFilters }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4 items-end">
      <Input
        placeholder="Search by name"
        value={filters.name}
        onChange={(e) => setFilters((prev: any) => ({ ...prev, name: e.target.value }))}
        className="w-[200px]"
      />

      <Select
        value={filters.status}
        onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, status: value === "all" ? "" : value }))
          }
      >
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Available for Adoption">Available</SelectItem>
            <SelectItem value="Adopted">Adopted</SelectItem>
            <SelectItem value="In Care">In Care</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, priority: value === "all" ? "" : value }))
        }
      >
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
