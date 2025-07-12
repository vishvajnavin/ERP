import React from 'react';
import { LucideIcon, Scissors, Hammer, Wrench, CheckCircle, Truck } from 'lucide-react';

// --- Type Definitions ---

interface PipelineItemProps {
  stage: string;
  count: number;
  Icon: LucideIcon;
  color: string;
}

// Production Pipeline Data
const pipelineData: PipelineItemProps[] = [
    { stage: "Cutting", count: 15, Icon: Scissors, color: "bg-sky-500" },
    { stage: "Framing", count: 12, Icon: Hammer, color: "bg-orange-500" },
    { stage: "Upholstery", count: 9, Icon: Wrench, color: "bg-indigo-500" },
    { stage: "Finishing & QC", count: 5, Icon: CheckCircle, color: "bg-teal-500" },
    { stage: "Ready for Delivery", count: 8, Icon: Truck, color: "bg-green-500" },
  ];

// Production Pipeline Component
const ProductionPipeline: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow-md h-full">
    <h3 className="text-xl font-bold text-gray-900 mb-4">Production Pipeline</h3>
    <div className="space-y-3">
      {pipelineData.map((item) => (
        <div key={item.stage} className="flex items-center">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 mr-4">
            <item.Icon className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-gray-700">{item.stage}</p>
              <p className="text-sm font-bold text-gray-800">{item.count} units</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={item.color} style={{ width: `${item.count * 5}%`, height: '100%', borderRadius: '9999px' }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProductionPipeline;
