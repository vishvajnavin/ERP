import React from 'react';
import { Sofa, ShoppingCart, DollarSign, Warehouse } from 'lucide-react';
import KpiCard, { KpiCardProps } from '@/components/dashboard/kpi-card';
import ProductionPipeline from '@/components/dashboard/production-pipeline';
import ProductionChart from '@/components/dashboard/production-chart';
import RecentOrders from '@/components/dashboard/recent-orders';

// --- Mock Data for the Dashboard ---

// KPI Card Data
const kpiData: KpiCardProps[] = [
  { title: "Sofas Produced Today", value: "74", change: "+5.7%", Icon: Sofa, color: "text-blue-500", bgColor: "bg-blue-100" },
  { title: "New Orders (Week)", value: "12", change: "+12.5%", Icon: ShoppingCart, color: "text-green-500", bgColor: "bg-green-100" },
  { title: "Weekly Revenue", value: "$45,670", change: "+8.2%", Icon: DollarSign, color: "text-yellow-500", bgColor: "bg-yellow-100" },
  { title: "Fabric Stock (meters)", value: "1,240", change: "-2.1%", Icon: Warehouse, color: "text-red-500", bgColor: "bg-red-100" },
];

// --- Main Dashboard Page Component ---
const DashboardPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiData.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductionChart />
        </div>
        <div className="lg:col-span-1">
          <ProductionPipeline />
        </div>
        <div className="lg:col-span-3">
            <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
