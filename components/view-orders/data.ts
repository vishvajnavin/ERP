import { Order, ProductionStage, ProgressState } from './types';
import { Scissors, Hammer, Wrench, CheckCircle, Truck, Circle, Loader, Check } from 'lucide-react';

export const productionStages: ProductionStage[] = [
    { name: "Cutting", Icon: Scissors },
    { name: "Framing", Icon: Hammer },
    { name: "Upholstery", Icon: Wrench },
    { name: "Finishing & QC", Icon: CheckCircle },
    { name: "Ready for Delivery", Icon: Truck },
];

export const progressStates: ProgressState[] = [
    { name: "Not Started", Icon: Circle },
    { name: "In Progress", Icon: Loader },
    { name: "Completed", Icon: Check },
];

export const initialOrdersData: Order[] = [
    { orderId: '#SOFA-8462', customer: 'John Doe', model: 'Chesterfield Classic', stage: 'Upholstery', progress: 'In Progress', dueDate: '2025-07-20', employees: ['Alice', 'Bob'] },
    { orderId: '#SOFA-8460', customer: 'Emily White', model: 'Velvet Loveseat', stage: 'Cutting', progress: 'Completed', dueDate: '2025-07-25', employees: ['Charlie'] },
    { orderId: '#SOFA-8457', customer: 'David Kim', model: 'Sectional Sleeper', stage: 'Framing', progress: 'Not Started', dueDate: '2025-07-22', employees: [] },
    { orderId: '#SOFA-8455', customer: 'Maria Garcia', model: 'Leather Recliner', stage: 'Ready for Delivery', progress: 'Completed', dueDate: '2025-07-15', employees: ['David', 'Eve'] },
    { orderId: '#SOFA-8454', customer: 'Tom Williams', model: 'Mid-Century Modern', stage: 'Finishing & QC', progress: 'In Progress', dueDate: '2025-07-18', employees: ['Frank'] },
    { orderId: '#SOFA-8452', customer: 'Linda Chen', model: 'Modern L-Shape', stage: 'Cutting', progress: 'Completed', dueDate: '2025-08-01', employees: ['Grace', 'Heidi'] },
];
