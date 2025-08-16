"use client";

"use client";

import React, { useMemo, useState, useEffect } from "react";
import { OrderHistory, OrderDetails } from "./types";
import FiltersBar from "./FiltersBar";
import OrderTable from "./OrderTable";
import Pagination from "./Pagination";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import KPI from "./KPI";
import { getOrderDetails } from "@/actions/get-order-details";

const formatCurrency = (amt: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amt);

type OrderHistoryClientProps = {
  initialOrders: OrderHistory[];
};

export default function OrderHistoryClient({ initialOrders }: OrderHistoryClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [filters, setFilters] = useState({ q: "", status: "" });
  const [sort, setSort] = useState({ by: "dueDate", dir: "desc" });
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let rows = [...orders];
    
    if (filters.q) {
      const q = filters.q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.id.toString().toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q)
      );
    }
    if (filters.status) {
      rows = rows.filter((r) => r.status === filters.status);
    }

    rows.sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.by === "total") {
        return (a.total - b.total) * dir;
      } else if (sort.by === 'orderDate' || sort.by === 'dueDate') {
        return (new Date(a[sort.by]).getTime() - new Date(b[sort.by]).getTime()) * dir;
      }
      return 0;
    });

    return rows;
  }, [orders, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  const handleViewOrder = async (order: OrderHistory) => {
    setIsLoadingDetails(true);
    const details = await getOrderDetails(order.id);
    setSelectedOrder(details);
    setIsLoadingDetails(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI title="Total Orders" value={filtered.length} />
        <KPI
          title="Revenue"
          value={formatCurrency(filtered.reduce((s, r) => s + r.total, 0))}
        />
        <KPI
          title="Completed Orders"
          value={filtered.filter((r) => r.status === "final_qc").length}
        />
        <KPI
          title="Pending Orders"
          value={filtered.filter((r) => r.status !== "final_qc").length}
        />
      </div>

      <FiltersBar
        filters={filters}
        setFilters={setFilters}
        count={filtered.length}
      />

      <OrderTable
        orders={pageRows}
        sort={sort}
        setSort={setSort}
        onViewOrder={handleViewOrder}
      />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
