import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Vehicle, Expense } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Coins, HandCoins, Warehouse, TrendingUp, Bike } from 'lucide-react';

interface DashboardProps {
    vehicles: Vehicle[];
    expenses: Expense[];
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; onClick: () => void; className?: string }> = ({ title, value, icon, onClick, className = '' }) => (
    <div onClick={onClick} className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center justify-between hover:shadow-lg  cursor-pointer transition-all duration-300 ${className}`}>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="bg-brand-100 p-4 rounded-full">
            {icon}
        </div>
    </div>
);

const parseLocalDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    const parts = dateString.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
};

const Dashboard: React.FC<DashboardProps> = ({ vehicles, expenses }) => {
    const navigate = useNavigate();

    const { chartData, stats } = useMemo(() => {
        const monthlyData: { [key: string]: { name: string; purchases: number; sales: number } } = {};
        const allDates: Date[] = [];

        vehicles.forEach(v => {
            const pDate = parseLocalDate(v.purchaseDate);
            if (pDate) allDates.push(pDate);
            
            const sDate = parseLocalDate(v.saleDate);
            if (sDate) allDates.push(sDate);
        });
        
        if (allDates.length > 0) {
            allDates.sort((a,b) => a.getTime() - b.getTime());
            const firstDate = allDates[0];
            const lastDate = new Date();

            let currentDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
            
            while(currentDate <= lastDate) {
                 const month = currentDate.toLocaleString('default', { month: 'short', year: '2-digit' });
                 monthlyData[month] = { name: month, purchases: 0, sales: 0 };
                 currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }
        
        vehicles.forEach(v => {
            const pDate = parseLocalDate(v.purchaseDate);
            if (pDate) {
                const month = pDate.toLocaleString('default', { month: 'short', year: '2-digit' });
                if (monthlyData[month]) {
                    monthlyData[month].purchases += 1;
                }
            }

            const sDate = parseLocalDate(v.saleDate);
            if (sDate) {
                const month = sDate.toLocaleString('default', { month: 'short', year: '2-digit' });
                if (monthlyData[month]) {
                    monthlyData[month].sales += 1;
                }
            }
        });

        const expensesByVehicle = expenses.reduce((acc, expense) => {
            acc[expense.vehicleId] = (acc[expense.vehicleId] || 0) + expense.amount;
            return acc;
        }, {} as { [key: string]: number });

        const totalInvested = vehicles
            .filter(v => v.status !== 'Sold')
            .reduce((acc, v) => {
                const vehicleExpenses = expensesByVehicle[v.id] || 0;
                return acc + v.purchasePrice + vehicleExpenses;
            }, 0);
        
        const availableCount = vehicles.filter(v => v.status === 'Available').length;
        const currentStock = vehicles.filter(v => v.status !== 'Sold').length;
        const totalVehicles = vehicles.length;

        const totalProfit = vehicles
            .filter(v => v.status === 'Sold' && v.sellingPrice)
            .reduce((acc, v) => {
                const vehicleExpenses = expensesByVehicle[v.id] || 0;
                const profit = v.sellingPrice! - v.purchasePrice - vehicleExpenses;
                return acc + profit;
            }, 0);


        return {
            chartData: Object.values(monthlyData),
            stats: {
                totalVehicles: totalVehicles.toString(),
                currentStock: currentStock.toString(),
                totalInvested: `₹${totalInvested.toLocaleString()}`,
                availableCount: availableCount.toString(),
                totalProfit: `₹${totalProfit.toLocaleString()}`,
            }
        };

    }, [vehicles, expenses]);

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dealership Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                 <StatCard 
                    title="Total Vehicles" 
                    value={stats.totalVehicles} 
                    icon={<Bike className="h-7 w-7 text-brand-500" />}
                    onClick={() => navigate('/inventory')}
                    className="hover:border-brand-500"
                 />
                 <StatCard 
                    title="Current Stock" 
                    value={stats.currentStock} 
                    icon={<Warehouse className="h-7 w-7 text-brand-500" />}
                    onClick={() => navigate('/inventory')}
                    className="hover:border-brand-500"
                 />
                 <StatCard 
                    title="Available for Sale" 
                    value={stats.availableCount} 
                    icon={<Coins className="h-7 w-7 text-brand-500" />}
                    onClick={() => navigate('/inventory?status=Available')} 
                    className="hover:border-brand-500"
                 />
                 <StatCard 
                    title="Total Investment" 
                    value={stats.totalInvested}
                    icon={<HandCoins className="h-7 w-7 text-accent-500" />}
                    onClick={() => navigate('/inventory')} 
                    className="hover:border-accent-500"
                 />
                 <StatCard 
                    title="Total Profit" 
                    value={stats.totalProfit}
                    icon={<TrendingUp className="h-7 w-7 text-brand-500" />}
                    onClick={() => navigate('/sales')}
                    className="hover:border-brand-500"
                 />
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Activity Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fill: '#6b7280' }} fontSize={12} />
                        <YAxis allowDecimals={false} tick={{ fill: '#6b7280' }} fontSize={12}/>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Legend wrapperStyle={{fontSize: "14px"}}/>
                        <Bar dataKey="purchases" fill="#10b981" name="New Stock" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="sales" fill="#3b82f6" name="Vehicles Sold" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;