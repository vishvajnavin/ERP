import React from 'react';
import { LucideIcon, Scissors, Hammer, Wrench, CheckCircle, Truck, Sofa } from 'lucide-react';
import { STAGE_CONFIG } from '@/components/view-orders/data';
import { Stage } from '@/components/view-orders/types';

// --- Type Definitions ---

interface ProductionPipelineProps {
  data: Partial<Record<Stage, number>>;
}

const STAGE_ICONS: Record<Stage, LucideIcon> = {
  carpentry: Hammer,
  webbing: Wrench,
  marking_cutting: Scissors,
  stitching: Sofa,
  cladding: Sofa,
  final_qc: CheckCircle,
};

// Production Pipeline Component
const ProductionPipeline: React.FC<ProductionPipelineProps> = ({ data }) => {
  const pipelineData = Object.entries(data).map(([stage, count]) => ({
    stage: STAGE_CONFIG[stage as Stage].label,
    count,
    Icon: STAGE_ICONS[stage as Stage],
    color: STAGE_CONFIG[stage as Stage].color,
  }));
  
  const totalInPipeline = pipelineData.reduce((sum, item) => sum + item.count, 0);

  return (
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
                <div className="bg-blue-500" style={{ width: `${(item.count / totalInPipeline) * 100}%`, height: '100%', borderRadius: '9999px', backgroundColor: item.color }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionPipeline;
