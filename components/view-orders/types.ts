// --- TYPE DEFINITIONS ---
export type Stage = 'carpentry' | 'webbing' | 'marking_cutting' | 'stitching' | 'cladding' | 'final_qc';
export type Priority = 0 | 1 | 2 | 3;
export type SortKey = 'dueDate' | 'priority' | 'id';
export type View = 'list' | 'kanban';

export type QCItems = { [item: string]: boolean };
export type QCChecklist = { [key in Stage]?: QCItems };

export interface Order {
  id: string;
  customer: string;
  product: string;
  upholstery: string;
  dueDate: string;
  stage: Stage;
  qc_checklist: QCChecklist;
  priority: Priority;
  productId: number;
  productType: 'Sofa' | 'Bed';
}
