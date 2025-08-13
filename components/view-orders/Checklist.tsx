'use client';

import { useState, useTransition } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  SkipForward,
  Loader2,
} from 'lucide-react';
import { updateCheckStatus } from '@/actions/update-check-status'; // Import the server action
import { CheckItem, CheckStatus } from './types';

// Props for the main component
type ChecklistProps = {
  checklist: CheckItem[];
  orderItemId: number; // Required to identify which order item to update
  stageName: string;
};

// Configuration for each status (icon, color, label)
const statusConfig: Record<
  CheckStatus,
  { icon: React.ReactNode; color: string; label: string }
> = {
  passed: {
    icon: <CheckCircle2 size={18} />,
    color: 'text-green-600 bg-green-100 border-green-200',
    label: 'Pass',
  },
  failed: {
    icon: <XCircle size={18} />,
    color: 'text-red-600 bg-red-100 border-red-200',
    label: 'Fail',
  },
  pending: {
    icon: <AlertCircle size={18} />,
    color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
    label: 'Pending',
  },
  skipped: {
    icon: <SkipForward size={18} />,
    color: 'text-gray-600 bg-gray-100 border-gray-200',
    label: 'Skip',
  },
};

export function Checklist({ checklist, orderItemId }: ChecklistProps) {
  const [isPending, startTransition] = useTransition();
  const [updatingCheckId, setUpdatingCheckId] = useState<number | null>(null);

  const handleStatusUpdate = (checkId: number, newStatus: CheckStatus) => {
    setUpdatingCheckId(checkId);
    startTransition(async () => {
      await updateCheckStatus(orderItemId, checkId, newStatus);
      setUpdatingCheckId(null);
    });
  };

  return (
    <div className="space-y-3">
      {checklist.map(item => {
        const isUpdating = isPending && updatingCheckId === item.check_id;
        return (
          <div
            key={item.check_id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {/* Left Side: Check Details */}
              <div className="mb-3 sm:mb-0">
                <p className="font-semibold text-gray-800">{item.name}</p>
                {item.notes && (
                  <p className="text-sm text-gray-500 mt-1">
                    Notes: {item.notes}
                  </p>
                )}
              </div>

              {/* Right Side: Status Actions */}
              <div className="flex items-center gap-2">
                {isUpdating ? (
                  <Loader2 className="animate-spin text-gray-400" />
                ) : (
                  (Object.keys(statusConfig) as CheckStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(item.check_id, status)}
                      disabled={isUpdating}
                      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                        item.status === status
                          ? statusConfig[status].color
                          : 'text-gray-500 bg-white hover:bg-gray-50'
                      }`}
                      aria-label={`Set status to ${statusConfig[status].label}`}
                    >
                      {statusConfig[status].icon}
                      <span>{statusConfig[status].label}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
            {item.updated_at && (
              <p className="text-xs text-right text-gray-400 mt-2">
                Last updated: {new Date(item.updated_at).toLocaleString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
