'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Search, ChevronDown, Filter } from 'lucide-react';
import { Customer } from '@/types/customers';
import CustomerCard from '@/components/customers/customer-card';
import CustomerDetailPanel from '@/components/customers/customer-detail-panel';
import AddCustomerModal from '@/components/customers/add-customer-modal';
import FilterPopover from '@/components/customers/filter-popover';
import { initialCustomers } from '@/components/customers/data';

// --- Customer Page Component ---
const CustomerPage = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    location: '',
    minSpend: '',
    maxSpend: '',
  });

  const filterPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(event.target as Node)) {
        setIsFilterPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterPopoverRef]);

  const filteredCustomers = useMemo(() =>
    customers
      .filter(customer => statusFilter === 'All' || customer.status === statusFilter)
      .filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(customer => advancedFilters.location ? customer.location.toLowerCase().includes(advancedFilters.location.toLowerCase()) : true)
      .filter(customer => advancedFilters.minSpend ? customer.totalSpend >= Number(advancedFilters.minSpend) : true)
      .filter(customer => advancedFilters.maxSpend ? customer.totalSpend <= Number(advancedFilters.maxSpend) : true),
    [customers, searchTerm, statusFilter, advancedFilters]
  );
  
  const activeFilterCount = Object.values(advancedFilters).filter(Boolean).length;

  const handleAddCustomer = (newCustomer: Omit<Customer, 'id' | 'dateAdded' | 'avatar' | 'totalOrders' | 'totalSpend' | 'lastOrder' | 'status'>) => {
    setCustomers(prev => [
      ...prev,
      {
        ...newCustomer,
        id: `CUS-${String(prev.length + 1).padStart(3, '0')}`,
        dateAdded: new Date().toISOString().slice(0, 10),
        avatar: `https://placehold.co/100x100/E0E7FF/3730A3?text=${newCustomer.name.charAt(0)}${newCustomer.name.split(' ').length > 1 ? newCustomer.name.split(' ')[1].charAt(0) : ''}`,
        totalOrders: 0,
        totalSpend: 0,
        lastOrder: 'N/A',
        status: 'New'
      }
    ]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="mt-1 text-sm text-gray-600">Manage customer relationships and order history.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Customer</span>
          </button>
        </div>

        {/* --- Search and Filter Bar --- */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-white pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            >
              <option value="All">All Status</option>
              <option value="VIP">VIP</option>
              <option value="Active">Active</option>
              <option value="New">New</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative" ref={filterPopoverRef}>
            <button
              onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
              className={`flex items-center gap-2 w-full sm:w-auto px-4 py-3 border rounded-lg transition ${activeFilterCount > 0 ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 bg-white'}`}
            >
              <Filter className="h-5 w-5" />
              <span>More Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            {isFilterPopoverOpen && (
              <FilterPopover 
                initialFilters={advancedFilters}
                onApply={setAdvancedFilters}
                onClose={() => setIsFilterPopoverOpen(false)}
              />
            )}
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="flex gap-6">
          <div className={`transition-all duration-500 ease-in-out ${selectedCustomer ? 'w-full lg:w-2/3' : 'w-full'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCustomers.map(customer => (
                <CustomerCard key={customer.id} customer={customer} onSelect={() => setSelectedCustomer(customer)} />
              ))}
            </div>
            {filteredCustomers.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 font-semibold">No customers found.</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
          {selectedCustomer && (
            <div className="w-full lg:w-1/3 transition-all duration-500 ease-in-out">
              <CustomerDetailPanel customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
            </div>
          )}
        </div>
      </div>
      <AddCustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddCustomer} />
    </div>
  );
};

export default CustomerPage;
