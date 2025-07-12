import { LucideIcon } from 'lucide-react';

export interface ProductionStage {
    name: string;
    Icon: LucideIcon;
}

export interface ProgressState {
    name: string;
    Icon: LucideIcon;
}

export interface Order {
    orderId: string;
    customer: string;
    model: string;
    stage: string;
    progress: string;
    dueDate: string;
    employees: string[];
}
