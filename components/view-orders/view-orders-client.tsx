"use client";
import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Order, View, Stage, Priority } from './types';
import { sampleOrders, PRIORITY_CONFIG, STAGE_CONFIG } from './data';
import Header from './Header';
import OrderTable from './OrderTable';
import KanbanBoard from './KanbanBoard';
import OrderModal from './OrderModal';

const ViewOrdersClient = () => {
  const [view, setView] = useState<View>('list');
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    stage: Partial<Record<Stage, boolean>>;
    priority: Partial<Record<Priority, boolean>>;
    overdue: { true?: boolean };
  }>({ stage: {}, priority: {}, overdue: {} });
  const [sortConfig, setSortConfig] = useState({ key: 'priority', direction: 'desc' });
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredAndSortedOrders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = orders.filter(o => {
      const stageKeys = Object.keys(activeFilters.stage).filter(k => activeFilters.stage[k as Stage]);
      if (stageKeys.length > 0 && !stageKeys.includes(o.stage)) return false;
      
      const priorityKeys = Object.keys(activeFilters.priority).filter(k => activeFilters.priority[k as Priority]);
      if (priorityKeys.length > 0 && !priorityKeys.includes(o.priority)) return false;

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
