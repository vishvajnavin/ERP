"use client";
import React, { useState } from 'react';
import { X, Trash2, UserPlus } from 'lucide-react';
import { Order } from './types';
import { productionStages, progressStates } from './data';

interface OrderDetailPanelProps {
    order: Order;
    onClose: () => void;
    onUpdate: (order: Order) => void;
}

const OrderDetailPanel: React.FC<OrderDetailPanelProps> = ({ order, onClose, onUpdate }) => {
    const [stage, setStage] = useState(order.stage);
    const [progress, setProgress] = useState(order.progress);
    const [employees, setEmployees] = useState(order.employees);
    const [newEmployee, setNewEmployee] = useState('');

    const handleAddEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEmployee.trim() && !employees.includes(newEmployee.trim())) {
            const updatedEmployees = [...employees, newEmployee.trim()];
            setEmployees(updatedEmployees);
            onUpdate({ ...order, employees: updatedEmployees });
            setNewEmployee('');
        }
    };

    const handleRemoveEmployee = (employeeToRemove: string) => {
        const updatedEmployees = employees.filter(emp => emp !== employeeToRemove);
        setEmployees(updatedEmployees);
        onUpdate({ ...order, employees: updatedEmployees });
    };
    
    const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStage = e.target.value;
        setStage(newStage);
        onUpdate({...order, stage: newStage, progress: 'Not Started' }); // Reset progress when stage changes
    }
    
    const handleProgressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProgress = e.target.value;
        setProgress(newProgress);
        onUpdate({...order, stage: stage, progress: newProgress });
    }
    
    const currentProgressIndex = progressStates.findIndex(s => s.name === progress);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-in h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{order.orderId}</h3>
                    <p className="text-gray-500">{order.model}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="h-6 w-6" />
                </button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2">
                {/* Stage Management */}
                <div className="mb-6">
                    <label htmlFor="stage-select" className="block text-sm font-bold text-gray-700 mb-2">Production Stage</label>
                    <select id="stage-select" value={stage} onChange={handleStageChange} className="w-full appearance-none bg-gray-50 pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                        {productionStages.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                </div>

                {/* Progress Management */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <label htmlFor="progress-select" className="block text-sm font-bold text-gray-700 mb-2">Stage Progress</label>
                    <div className="flex items-center mb-4">
                        {progressStates.map((pState, index) => {
                            const isCompleted = index <= currentProgressIndex;
                            return (
                                <React.Fragment key={pState.name}>
                                    <div className="relative flex flex-col items-center" title={pState.name}>
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            <pState.Icon className={`h-5 w-5 ${pState.name === 'In Progress' ? 'animate-spin' : ''}`} />
                                        </div>
                                    </div>
                                    {index < progressStates.length - 1 && (
                                        <div className={`flex-1 h-1 transition-colors duration-300 ${isCompleted ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                     <select id="progress-select" value={progress} onChange={handleProgressChange} className="w-full appearance-none bg-gray-50 pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                        {progressStates.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                </div>

                {/* Employee Management */}
                <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-2">Assigned Employees</h4>
                    <div className="space-y-2 mb-4">
                        {employees.length > 0 ? employees.map(emp => (
                            <div key={emp} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                <span className="text-gray-800">{emp}</span>
                                <button onClick={() => handleRemoveEmployee(emp)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )) : <p className="text-sm text-gray-500 italic">No employees assigned.</p>}
                    </div>
                    <form onSubmit={handleAddEmployee} className="flex gap-2">
                        <input
                            type="text"
                            value={newEmployee}
                            onChange={(e) => setNewEmployee(e.target.value)}
                            placeholder="Add employee name..."
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                        <button type="submit" className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700">
                            <UserPlus size={16} />
                        </button>
                    </form>
                </div>
            </div>
            <style jsx>{`
                @keyframes slide-in-from-right {
                  from { transform: translateX(100%); opacity: 0; }
                  to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in { animation: slide-in-from-right 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default OrderDetailPanel;
