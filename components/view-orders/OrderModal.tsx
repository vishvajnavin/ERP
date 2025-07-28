"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, Stage, Priority } from './types';
import { STAGE_CONFIG, PRIORITY_CONFIG } from './data';
import { icons } from './icons';

interface OrderModalProps {
  order: Order;
  onClose: () => void;
  onChecklistChange: (orderId: string, stage: Stage, itemKey: string, isChecked: boolean) => void;
  onProceed: (orderId: string) => void;
  onPriorityChange: (orderId: string, priority: Priority) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ order, onClose, onChecklistChange, onProceed, onPriorityChange }) => {
  const [isQCChecklistVisible, setQCChecklistVisible] = useState(false);
  const allStages = Object.keys(STAGE_CONFIG) as Stage[];
  const activeStepIndex = allStages.indexOf(order.stage);
  const currentChecklist = order.qc_checklist[order.stage];
  const isChecklistComplete = currentChecklist ? Object.values(currentChecklist).every(v => v) : true;
  const isFinalStage = activeStepIndex === allStages.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl text-black border border-gray-200 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-black">
              {order.id} - <span className="text-red-600">{order.product}</span>
            </h2>
            <p className="text-sm text-gray-600">{order.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <icons.close />
          </button>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
          <AnimatePresence mode="wait">
            {isQCChecklistVisible ? (
              <motion.div key="qc" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <h3 className="text-xl font-bold text-center text-red-600 mb-4">
                  QC Checklist: {STAGE_CONFIG[order.stage].label}
                </h3>
                <div className="space-y-3 bg-gray-50 p-6 rounded-lg border border-gray-200">
                  {currentChecklist && Object.keys(currentChecklist).length > 0 ? (
                    Object.entries(currentChecklist).map(([item, checked]) => (
                      <label key={item} className="flex items-center text-black cursor-pointer p-3 rounded-md hover:bg-gray-100/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => onChecklistChange(order.id, order.stage, item, e.target.checked)}
                          className="h-5 w-5 rounded-sm bg-gray-200 border-gray-300 text-red-600 focus:ring-red-600 focus:ring-offset-white"
                        />
                        <span className="ml-4 text-sm">{item}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-center py-4">No QC checklist for this stage.</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="details" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4 text-sm">
                    <h3 className="text-lg font-semibold text-black mb-2">Order Details</h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-100/50 p-4 rounded-lg">
                      <div>
                        <span className="font-semibold text-gray-600 block">Customer</span>
                        <p>{order.customer}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 block">Config</span>
                        <p>{order.config}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 block">Upholstery</span>
                        <p>{order.upholsteryColor}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 block">Leg Type</span>
                        <p>{order.legType}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-black mb-2">Status & Priority</h3>
                    <div className="bg-gray-100/50 p-4 rounded-lg space-y-4">
                      <div>
                        <span className="font-semibold text-gray-600 block">Due Date</span>
                        <p className={`${new Date(order.dueDate) < new Date() ? 'text-red-600' : ''}`}>
                          {new Date(order.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600 block mb-1">Priority</label>
                        <select
                          value={order.priority}
                          onChange={e => onPriorityChange(order.id, e.target.value as Priority)}
                          className="w-full bg-gray-200 border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
                        >
                          {Object.keys(PRIORITY_CONFIG).map(p => (
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
              {allStages.map((stage, index) => (
                <React.Fragment key={stage}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                      index <= activeStepIndex ? 'border-red-600 bg-red-600 text-white' : 'border-gray-300 bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < activeStepIndex ? <icons.check className="w-4 h-4" /> : index + 1}
                  </div>
                  {index < allStages.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 w-16 ${index < activeStepIndex ? 'bg-red-600' : 'bg-gray-300'}`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex gap-2">
              {isQCChecklistVisible ? (
                <>
                  <button
                    onClick={() => setQCChecklistVisible(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-800 bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  {!isFinalStage && (
                    <button
                      onClick={() => onProceed(order.id)}
                      disabled={!isChecklistComplete}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Proceed
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setQCChecklistVisible(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <icons.check /> QC Checklist
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
