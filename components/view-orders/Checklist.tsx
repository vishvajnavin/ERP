'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, AlertCircle } from 'lucide-react';

type CheckItem = {
  check_id: number;
  name: string;
  status: 'completed' | 'pending' | 'rejected';
  notes?: string;
  inspected_by?: string;
  updated_at?: string;
};

type ChecklistProps = {
  checklist: CheckItem[];
  onBack: () => void;
  stageName: string;
};

const statusIcons = {
  completed: <Check className="text-green-500" />,
  pending: <AlertCircle className="text-yellow-500" />,
  rejected: <X className="text-red-500" />,
};

export function Checklist({ checklist, onBack, stageName }: ChecklistProps) {
  return (
    <div className="space-y-4">
      {checklist.map(item => (
        <div
          key={item.check_id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-4">
            {statusIcons[item.status]}
            <div>
              <p className="font-semibold text-sm">{item.name}</p>
              {item.notes && (
                <p className="text-xs text-gray-500">Notes: {item.notes}</p>
              )}
            </div>
          </div>
          <div className="text-right text-xs">
            {item.inspected_by && <p>Inspected by: {item.inspected_by}</p>}
            {item.updated_at && (
              <p className="text-gray-500">
                Last updated: {new Date(item.updated_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
