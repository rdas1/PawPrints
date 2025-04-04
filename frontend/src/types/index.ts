export interface Pet {
    id: number;
    name: string;
    status: "Available for Adoption" | "Adopted" | "In Care";
    animal_type: string; // Note: this is joined in from the backend
    priority: "Low" | "Medium" | "High";
}

// TODO: investigate whether animal_type or animal_type_id is better here