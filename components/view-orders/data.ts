import { Stage, Priority, Order } from './types';

export const STAGE_CONFIG: Record<Stage, { label: string; color: string; }> = {
  carpentry: { label: 'Carpentry', color: '#b91c1c' },       // Red-700
  webbing: { label: 'Webbing', color: '#dc2626' },         // Red-600
  marking_cutting: { label: 'Marking', color: '#ef4444' }, // Red-500
  stitching: { label: 'Stitching', color: '#f87171' },     // Red-400
  cladding: { label: 'Cladding', color: '#fca5a5' },       // Red-300
  final_qc: { label: 'Final QC', color: '#fecaca' },         // Red-200
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; value: number }> = {
  Urgent: { label: 'Urgent', color: '#b91c1c', value: 4 },
  High: { label: 'High', color: '#ef4444', value: 3 },
  Medium: { label: 'Medium', color: '#9ca3af', value: 2 },
  Low: { label: 'Low', color: '#6b7280', value: 1 },
};

export const sampleOrders: Order[] = [
  { id: 'OCF-001', customer: 'Rajesh Kumar', product: 'Royal Recliner', description: 'A luxurious reclining sofa with an adjustable headrest and premium leather.', config: '3 Seater', upholsteryColor: 'Crimson Red', legType: 'Wood', placedAt: '2025-07-01', dueDate: '2025-07-29', stage: 'carpentry', qc_checklist: { carpentry: { 'Frame assembled': false, 'Joints secured': false, 'Wood quality checked': false } }, priority: 'High' },
  { id: 'OCF-002', customer: 'Anita Desai', product: 'L-Corner Static', description: 'Modern L-shaped static sofa, perfect for contemporary living rooms.', config: 'Left-Hand Corner', upholsteryColor: 'Jet Black', legType: 'PVD', placedAt: '2025-07-02', dueDate: '2025-08-05', stage: 'stitching', qc_checklist: { stitching: { 'Seams are strong': false, 'No loose threads': false } }, priority: 'Medium' },
  { id: 'OCF-003', customer: 'Vikram Singh', product: '3+2 Sofa Set', description: 'A classic 3+2 sofa combination for family seating.', config: 'Standard', upholsteryColor: 'Ivory White', legType: 'SS', placedAt: '2025-07-03', dueDate: '2025-07-26', stage: 'cladding', qc_checklist: { cladding: { 'Fabric smooth': false, 'No wrinkles': false } }, priority: 'Urgent' },
  { id: 'OCF-004', customer: 'Priya Sharma', product: 'Chesterfield', description: 'An iconic Chesterfield sofa with deep button tufting and rolled arms.', config: '2 Seater', upholsteryColor: 'Oxford Blue', legType: 'Wood', placedAt: '2025-07-05', dueDate: '2025-08-10', stage: 'webbing', qc_checklist: { webbing: { 'Springs attached': false } }, priority: 'Medium' },
  { id: 'OCF-005', customer: 'Sanjay Gupta', product: 'Modular Sectional', description: 'A versatile modular sectional that can be rearranged to fit any space.', config: '5-piece Sectional', upholsteryColor: 'Graphite Gray', legType: 'SS', placedAt: '2025-07-08', dueDate: '2025-08-15', stage: 'marking_cutting', qc_checklist: { marking_cutting: { 'All pieces cut': false } }, priority: 'Low' },
  { id: 'OCF-006', customer: 'Meera Iyer', product: 'Sofa Bed', description: 'A functional and stylish sofa bed with an easy-to-use pull-out mechanism.', config: 'Queen Size', upholsteryColor: 'Beige', legType: 'PVD', placedAt: '2025-07-10', dueDate: '2025-07-28', stage: 'final_qc', qc_checklist: { final_qc: { 'Mechanism works': false } }, priority: 'High' },
];
