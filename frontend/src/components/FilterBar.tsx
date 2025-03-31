import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export function FilterBar({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-4 items-center p-4">
      <Input
        placeholder="Search by name"
        value={filters.name}
        onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
      />

      <Select
        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
        defaultValue={filters.status}
      >
        <SelectTrigger className="w-[180px]">Status</SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          <SelectItem value="Available for Adoption">Available</SelectItem>
          <SelectItem value="Adopted">Adopted</SelectItem>
          <SelectItem value="In Care">In Care</SelectItem>
        </SelectContent>
      </Select>

      {/* You could also add Priority and Animal Type dropdowns here */}
    </div>
  );
}
