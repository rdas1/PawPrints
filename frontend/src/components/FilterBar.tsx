import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { AnimalType } from "@/api/animalTypes";

interface FilterBarProps {
    filters: any;
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    animalTypes: AnimalType[];
}

export function FilterBar({ filters, setFilters, animalTypes }: FilterBarProps) {
    return (
        <div className="flex flex-wrap gap-4 items-end">
            <Input
                placeholder="Search by name"
                value={filters.name}
                onChange={(e) => setFilters((prev: any) => ({ ...prev, name: e.target.value }))}
                className="w-[180px] bg-white border border-[#dcdcdc]"
            />

            <Select
                value={filters.status}
                onValueChange={(value) =>
                    setFilters((prev: any) => ({ ...prev, status: value === "all" ? "" : value }))
                }
            >
                <SelectTrigger className="w-[180px] bg-white border border-[#dcdcdc] ">
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
                <SelectTrigger className="w-[180px] bg-white border border-[#dcdcdc]">
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="Low">Low Priority</SelectItem>
                </SelectContent>
            </Select>
            
            <Select
                value={filters.animal_type_id?.toString() || ""}
                onValueChange={(value) =>
                    setFilters((prev: any) => ({
                        ...prev,
                        animal_type_id: value === "all" ? "" : Number(value)
                    }))
                }
            >
                <SelectTrigger className="w-[180px] bg-white border border-[#dcdcdc]">
                    <SelectValue placeholder="Animal Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {animalTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.sortBy ? `${filters.sortBy}|${filters.sortOrder}` : ""}
                onValueChange={(value) => {
                    if (value === "none") {
                        setFilters((prev: any) => ({ ...prev, sortBy: "", sortOrder: "" }));
                    } else {
                        const [sortBy, sortOrder] = value.split("|");
                        setFilters((prev: any) => ({ ...prev, sortBy, sortOrder }));
                    }
                }}
            >
                <SelectTrigger className="w-[180px] bg-white border border-[#dcdcdc]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">No Sorting</SelectItem>
                    <SelectItem value="priority|desc">Priority</SelectItem>
                    <SelectItem value="name|asc">Name (A → Z)</SelectItem>
                    <SelectItem value="name|desc">Name (Z → A)</SelectItem>
                </SelectContent>
            </Select>

        </div>
    );
}