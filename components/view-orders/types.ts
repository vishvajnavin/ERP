// --- TYPE DEFINITIONS ---
export type Stage = 'carpentry' | 'webbing' | 'marking_cutting' | 'stitching' | 'cladding' | 'final_qc';
export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type SortKey = 'dueDate' | 'priority' | 'id';
export type View = 'list' | 'kanban';

export type QCItems = { [item: string]: boolean };
export type QCChecklist = { [key in Stage]?: QCItems };

export interface Order {
  id: string;
  customer: string;
  product: string;
  description: string;
  config: string;
  upholsteryColor: string;
  legType: string;
  placedAt: string;
  dueDate: string;
  stage: Stage;
  qc_checklist: QCChecklist;
  priority: Priority;
}
