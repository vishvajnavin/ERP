"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, ChevronDown, ChevronUp } from "lucide-react";

type FiltersBarProps = {
  filters: { q: string; status: string };
  setFilters: React.Dispatch<React.SetStateAction<{ q: string; status: string }>>;
  count: number;
};

const STATUSES = [
  "carpentry",
  "webbing",
  "marking_cutting",
  "stitching",
  "cladding",
  "final_qc",
];

export default function FiltersBar({ filters, setFilters, count }: FiltersBarProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Filter className="w-4 h-4" />
          Filters
          <span className="text-gray-400">• {count} results</span>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="text-gray-500">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t p-3 grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <div className="col-span-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                value={filters.q}
                onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Search order ID, customer, product..."
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
