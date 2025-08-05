"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Order, View, Stage, Priority } from './types';
import { STAGE_CONFIG } from './data';
import Header from './Header';
import OrderTable from './OrderTable';
import KanbanBoard from './KanbanBoard';
import OrderModal from './OrderModal';
import { getOrderItems } from '@/actions/get-order-items';
import { searchOrderItems } from '@/actions/search-order-items';
import { Button } from '../ui/button';

interface ViewOrdersClientProps {
  initialOrders: Order[];
  totalCount: number;
}

const ViewOrdersClient: React.FC<ViewOrdersClientProps> = ({ initialOrders, totalCount }) => {
  const [view, setView] = useState<View>('list');
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    stage: Partial<Record<Stage, boolean>>;
    priority: Partial<Record<string, boolean>>;
    overdue: { true?: boolean };
  }>({ stage: {}, priority: {}, overdue: {} });
  const [sortConfig, setSortConfig] = useState({ key: 'priority', direction: 'desc' });
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(Math.ceil(totalCount / itemsPerPage));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      let result;
      if (search) {
        result = await searchOrderItems(search, currentPage, itemsPerPage, activeFilters, sortConfig);
      } else {
        // When not searching, we don't need to pass filters and sorting
        result = await getOrderItems(currentPage, itemsPerPage);
      }
      setOrders(result.orders);
      setTotalPages(Math.ceil(result.totalCount / itemsPerPage));
      setLoading(false);
    };

    const debounceFetch = setTimeout(() => {
      fetchOrders();
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceFetch);
  }, [search, currentPage, itemsPerPage, activeFilters, sortConfig]);

  const filteredAndSortedOrders = useMemo(() => {
    return orders;
  }, [orders]);


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
              <div className="p-6 pb-20">
                <OrderTable orders={filteredAndSortedOrders} onOrderSelect={setSelectedOrder} />
                <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-center items-center space-x-2">
                  <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1 || loading}>
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || loading}>
                    Next
                  </Button>
                </div>
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
            onProceed={handleProceedToNextStage}
            onPriorityChange={handlePriorityChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewOrdersClient;
