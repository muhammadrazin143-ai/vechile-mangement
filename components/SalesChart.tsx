import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
    name: string;
    sales: number;
}

interface SalesChartProps {
    data: ChartData[];
    colors: {
        bar: string;
        highlight: string;
    };
}

const SalesChart: React.FC<SalesChartProps> = ({ data, colors }) => {

    const maxSales = useMemo(() => 
        Math.max(...data.map(item => item.sales)), 
    [data]);

    const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-bold text-gray-800">{label}</p>
                    <p className="text-sm" style={{ color: colors.bar }}>
                        Sales: <span className="font-medium">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280' }} 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                    allowDecimals={false} 
                    tick={{ fill: '#6b7280' }} 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
                <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.sales === maxSales && maxSales > 0 ? colors.highlight : colors.bar} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SalesChart;
