"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Order, Stage, Priority } from "./types";
import { STAGE_CONFIG, PRIORITY_CONFIG } from "./data";
import { icons } from "./icons";
import getProductDetails from "@/actions/get-product-details";
import ProductDetails from "./ProductDetails";
import {
  getQcChecklist,
  QcChecklist,
  CheckItem,
} from "@/actions/get-qc-checklist";
import { updateCheckStatus } from "@/actions/update-check-status";

interface OrderModalProps {
  order: Order;
  onClose: () => void;
  onProceed: (orderId: string) => void;
  onPriorityChange: (orderId: string, priority: Priority) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  order,
  onClose,
  onProceed,
  onPriorityChange,
}) => {
  const [productDetails, setProductDetails] =
    useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showQcChecklist, setShowQcChecklist] = useState(false);
  const [checklistData, setChecklistData] = useState<QcChecklist | null>(null);
  const [isQcLoading, setIsQcLoading] = useState(false);

  const allStages = Object.keys(STAGE_CONFIG) as Stage[];
  const activeStepIndex = allStages.indexOf(order.stage);
  const isFinalStage = activeStepIndex === allStages.length - 1;

  const handleFetchQcChecklist = async () => {
    setIsQcLoading(true);
    const { data, error } = await getQcChecklist(parseInt(order.id, 10));
    if (error) {
      console.error(error);
    } else {
      setChecklistData(data);
    }
    setIsQcLoading(false);
    setShowQcChecklist(true);
  };

  const handleUpdateCheck = async (
    checkId: number,
    newStatus: CheckItem["status"]
  ) => {
    // Optimistically update UI
    if (checklistData) {
      const updatedData = { ...checklistData };
      let found = false;
      for (const stageName in updatedData) {
        const checkIndex = updatedData[stageName].findIndex(
          (c) => c.check_id === checkId
        );
        if (checkIndex !== -1) {
          updatedData[stageName][checkIndex].status = newStatus;
          found = true;
          break;
        }
      }
      if (found) {
        setChecklistData(updatedData);
      }
    }

    // Call server action
    await updateCheckStatus(parseInt(order.id, 10), checkId, newStatus);
    // No need to re-fetch, revalidation will handle it if optimistic update fails
  };

  const statusOptions: CheckItem["status"][] = [
    "pending",
    "passed",
    "failed",
    "skipped",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      suppressHydrationWarning
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl text-black border border-gray-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-black">
              {order.id} - <span className="text-red-600">{order.product}</span>
            </h2>
            <p className="text-sm text-gray-600">{order.customer}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <icons.close />
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          <AnimatePresence mode="wait">
            {showQcChecklist ? (
              // QC CHECKLIST VIEW
              <motion.div
                key="qc"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-red-600">
                    Active QC Checklists
                  </h3>
                  <button
                    onClick={() => setShowQcChecklist(false)}
                    className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1"
                  >
                    Back to Details
                  </button>
                </div>
                <div className="space-y-6">
                  {isQcLoading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                  ) : checklistData &&
                    Object.keys(checklistData).length > 0 ? (
                    Object.entries(checklistData).map(([stageName, checks]) => (
                      <div
                        key={stageName}
                        className="bg-gray-50 p-4 rounded-lg border"
                      >
                        <h4 className="font-bold text-lg mb-3 text-black">
                          {stageName}
                        </h4>
                        <div className="space-y-2">
                          {checks.map((item) => (
                            <div
                              key={item.check_id}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
                            >
                              <span className="text-sm text-gray-800">
                                {item.name}
                              </span>
                              <div className="flex items-center gap-2">
                                {statusOptions.map((status) => (
                                  <label
                                    key={status}
                                    className="flex items-center cursor-pointer text-xs"
                                  >
                                    <input
                                      type="radio"
                                      name={`check-${item.check_id}`}
                                      value={status}
                                      checked={item.status === status}
                                      onChange={() =>
                                        handleUpdateCheck(
                                          item.check_id,
                                          status
                                        )
                                      }
                                      className="h-4 w-4 mr-1"
                                    />
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-center py-4">
                      No active QC checklists for this order.
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              // ORDER DETAILS VIEW
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4 text-sm">
                    <h3 className="text-lg font-semibold text-black mb-2">
                      Order Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-100/50 p-4 rounded-lg">
                      <div>
                        <span className="font-semibold text-gray-600 block">
                          Customer
                        </span>
                        <p>{order.customer}</p>
                      </div>
                      <div>
                        <button
                          onClick={async () => {
                            setIsLoading(true);
                            const details = await getProductDetails(
                              order.productId,
                              order.productType
                            );
                            setProductDetails(details.data);
                            setIsLoading(false);
                          }}
                          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading..." : "View Details"}
                        </button>
                      </div>
                      {productDetails && (
                        <div className="col-span-2 mt-4">
                          <ProductDetails
                            details={productDetails}
                            productType={order.productType}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-black mb-2">
                      Status & Priority
                    </h3>
                    <div className="bg-gray-100/50 p-4 rounded-lg space-y-4">
                      <div>
                        <span className="font-semibold text-gray-600 block">
                          Due Date
                        </span>
                        <p
                          className={`${
                            new Date(order.dueDate) < new Date()
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {new Date(order.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600 block mb-1">
                          Priority
                        </label>
                        <select
                          value={order.priority}
                          onChange={(e) =>
                            onPriorityChange(
                              order.id,
                              Number(e.target.value) as Priority
                            )
                          }
                          className="w-full bg-gray-200 border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
                        >
                          {Object.keys(PRIORITY_CONFIG).map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50/30 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Stage progress bar remains the same */}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFetchQcChecklist}
                className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
              >
                QC Checklist
              </button>
              {!isFinalStage && (
                <button
                  onClick={() => onProceed(order.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Proceed
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderModal;
