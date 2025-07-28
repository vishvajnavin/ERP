"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Order, View, Stage, Priority } from './types';
import { PRIORITY_CONFIG, STAGE_CONFIG } from './data';
import { getOrderItems } from '@/actions/get-order-items';
import Header from './Header';
const STAGE_CHECKLISTS: Record<Stage, { key: string; label: string }[]> = {
  carpentry: [
    { key: 'frame_assembled', label: 'Frame assembled' },
    { key: 'joints_secured', label: 'Joints secured' },
    { key: 'wood_quality_checked', label: 'Wood quality checked' },
  ],
  webbing: [{ key: 'springs_attached', label: 'Springs attached' }],
  marking_cutting: [{ key: 'all_pieces_cut', label: 'All pieces cut' }],
  stitching: [
    { key: 'seams_strong', label: 'Seams are strong' },
    { key: 'no_loose_threads', label: 'No loose threads' },
  ],
  cladding: [
    { key: 'fabric_smooth', label: 'Fabric smooth' },
    { key: 'no_wrinkles', label: 'No wrinkles' },
  ],
  final_qc: [{ key: 'mechanism_works', label: 'Mechanism works' }],
};
import OrderTable from './OrderTable';
import KanbanBoard from './KanbanBoard';
import OrderModal from './OrderModal';

const ViewOrdersClient = () => {
  const [view, setView] = useState<View>('list');
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    stage: Partial<Record<Stage, boolean>>;
    priority: Partial<Record<string, boolean>>;
    overdue: { true?: boolean };
  }>({ stage: {}, priority: {}, overdue: {} });
  const [sortConfig, setSortConfig] = useState({ key: 'priority', direction: 'desc' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await getOrderItems();
      const ordersWithChecklist = fetchedOrders.map((o) => ({
        ...o,
        qc_checklist:
          o.qc_checklist ||
          Object.fromEntries(
            Object.keys(STAGE_CHECKLISTS).map((stage) => [
              stage,
              Object.fromEntries(
                (STAGE_CHECKLISTS[stage as Stage] || []).map((item) => [item.key, false])
              ),
            ])
          ),
      }));
      setOrders(ordersWithChecklist);
    };
    fetchOrders();
  }, []);

  const filteredAndSortedOrders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = orders.filter(o => {
      const stageKeys = Object.keys(activeFilters.stage).filter(k => activeFilters.stage[k as Stage]);
      if (stageKeys.length > 0 && !stageKeys.includes(o.stage)) return false;
      
      const priorityKeys = Object.keys(activeFilters.priority).filter(k => activeFilters.priority[k]);
      if (priorityKeys.length > 0 && !priorityKeys.includes(o.priority.toString())) return false;

      if (activeFilters.overdue.true && new Date(o.dueDate) >= today) return false;
      
      const q = search.toLowerCase();
      return !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
    });

    return filtered.sort((a, b) => {
      let valA, valB;
      if (sortConfig.key === 'priority') {
        valA = PRIORITY_CONFIG[a.priority].value;
        valB = PRIORITY_CONFIG[b.priority].value;
      } else if (sortConfig.key === 'dueDate') {
        valA = new Date(a.dueDate).getTime();
        valB = new Date(b.dueDate).getTime();
      } else {
        valA = a.id;
        valB = b.id;
      }
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, search, activeFilters, sortConfig]);

  const handleChecklistChange = (orderId: string, stage: Stage, itemKey: string, isChecked: boolean) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, qc_checklist: { ...o.qc_checklist, [stage]: { ...o.qc_checklist[stage], [itemKey]: isChecked } } }
          : o
      )
    );
    setSelectedOrder(prev =>
      prev && prev.id === orderId
        ? { ...prev, qc_checklist: { ...prev.qc_checklist, [stage]: { ...prev.qc_checklist[stage], [itemKey]: isChecked } } }
        : prev
    );
  };

  const handlePriorityChange = (orderId: string, priority: Priority) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, priority } : o)));
    setSelectedOrder(prev => (prev && prev.id === orderId ? { ...prev, priority } : prev));
  };

  const handleProceedToNextStage = (orderId: string) => {
    const allStages = Object.keys(STAGE_CONFIG) as Stage[];
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const currentStageIndex = allStages.indexOf(order.stage);
    if (currentStageIndex < allStages.length - 1) {
      const nextStage = allStages[currentStageIndex + 1];
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, stage: nextStage } : o)));
      setSelectedOrder(null);
    }
  };

  return (
    <div className="bg-white min-h-screen text-black font-sans antialiased">
      <Header
        view={view}
        setView={setView}
        search={search}
        setSearch={setSearch}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
      />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'list' && (
              <div className="p-6">
                <OrderTable orders={filteredAndSortedOrders} onOrderSelect={setSelectedOrder} />
              </div>
            )}
            {view === 'kanban' && (
              <div className="p-6">
                <KanbanBoard orders={filteredAndSortedOrders} onOrderSelect={setSelectedOrder} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onChecklistChange={handleChecklistChange}
            onProceed={handleProceedToNextStage}
            onPriorityChange={handlePriorityChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewOrdersClient;
