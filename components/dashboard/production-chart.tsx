"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Type Definitions ---

interface ProductionChartData {
  day: string;
  produced: number;
}

// Production Output Chart Data (Last 7 Days)
const productionChartData: ProductionChartData[] = [
  { day: 'Mon', produced: 68 },
  { day: 'Tue', produced: 74 },
  { day: 'Wed', produced: 65 },
  { day: 'Thu', produced: 78 },
  { day: 'Fri', produced: 82 },
  { day: 'Sat', produced: 90 },
  { day: 'Sun', produced: 74 },
];

// Production Chart Component
const ProductionChart: React.FC = () => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Production Output</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={productionChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <Tooltip
                        cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                    />
                    <Legend iconType="circle" iconSize={10} />
                    <Bar dataKey="produced" fill="#EF4444" name="Sofas Produced" barSize={30} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default ProductionChart;
