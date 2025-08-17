import React from 'react';
import { ShoppingCart, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import KpiCard from '@/components/dashboard/kpi-card';
import ProductionPipeline from '@/components/dashboard/production-pipeline';
import ProductionChart from '@/components/dashboard/production-chart';
import RecentOrders from '@/components/dashboard/recent-orders';
import { getDashboardData } from '@/actions/get-dashboard-data';

// --- Main Dashboard Page Component ---
const DashboardPage: React.FC = async () => {
  const data = await getDashboardData();

  if (!data) {
    return <div>Error loading dashboard data.</div>;
  }

  const kpiData = [
    { title: "Total Orders", value: data.total_orders.toString(), Icon: ShoppingCart, color: "text-blue-500", bgColor: "bg-blue-100" },
    { title: "In Production", value: data.orders_in_production.toString(), Icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-100" },
    { title: "Completed (30d)", value: data.completed_orders_month.toString(), Icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-100" },
    { title: "Overdue", value: data.overdue_orders.toString(), Icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-100" },
  ];

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
          <ProductionChart data={data.production_chart || []} />
        </div>
        <div className="lg:col-span-1">
          <ProductionPipeline data={data.production_pipeline || {}} />
        </div>
        <div className="lg:col-span-3">
            <RecentOrders data={data.recent_orders || []} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
