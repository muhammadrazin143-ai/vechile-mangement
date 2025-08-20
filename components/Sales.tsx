import React, { useState, useMemo } from 'react';
import type { Vehicle, Expense } from '../types';
import { Search, TrendingUp, CalendarDays, User, Phone, DollarSign, Wallet } from 'lucide-react';
import SalesChart from './SalesChart';

interface SalesProps {
  vehicles: Vehicle[]; // Expects only sold vehicles
  expenses: Expense[];
}

const SaleCard: React.FC<{ sale: Vehicle; totalExpenses: number }> = ({ sale, totalExpenses }) => {
    const profit = (sale.sellingPrice || 0) - sale.purchasePrice - totalExpenses;
    
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 space-y-4 transition-shadow hover:shadow-lg flex flex-col h-full">
            <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <div>
                    <p className="font-bold text-brand-500 text-lg">{sale.brandModel}</p>
                    <p className="text-sm text-gray-500">{sale.vehicleNumber}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <p className={`font-bold text-xl ${profit >= 0 ? 'text-brand-600' : 'text-red-600'}`}>₹{profit.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 font-medium">Profit</p>
                </div>
            </div>

            <div className="space-y-3 text-sm flex-grow">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 flex items-center"><User className="w-4 h-4 mr-2 text-gray-400"/>Buyer Name</span>
                    <span className="text-gray-800 font-medium">{sale.buyerName}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-400"/>Buyer Contact</span>
                    <span className="text-gray-800">{sale.buyerContact}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 flex items-center"><DollarSign className="w-4 h-4 mr-2 text-gray-400"/>Sold Amount</span>
                    <span className="text-gray-800 font-semibold">₹{sale.sellingPrice?.toLocaleString() || 'N/A'}</span>
                </div>
            </div>

            {(sale.financierName || (sale.financierAmount ?? 0) > 0 || (sale.saleBalance ?? 0) > 0) && (
                <div className="border-t border-gray-100 pt-3 mt-auto">
                    <h4 className="font-semibold text-gray-700 mb-2 text-base flex items-center"><Wallet className="w-4 h-4 mr-2 text-gray-500"/>Finance Details</h4>
                    <div className="space-y-2 text-sm pl-6">
                        {sale.financierName && (
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Financier:</span>
                                <span className="text-gray-800">{sale.financierName}</span>
                            </div>
                        )}
                        {(sale.financierAmount ?? 0) > 0 && (
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Financed Amount:</span>
                                <span className="text-gray-800 font-semibold">₹{(sale.financierAmount || 0).toLocaleString()}</span>
                            </div>
                        )}
                        {sale.financeCreditedDate && (
                             <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Finance Credited:</span>
                                <span className="text-gray-800">{new Date(sale.financeCreditedDate).toLocaleDateString()}</span>
                            </div>
                        )}
                        {(sale.saleBalance ?? 0) > 0 && (
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Pending Amount:</span> 
                                <span className="font-bold text-red-600">₹{(sale.saleBalance || 0).toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const Sales: React.FC<SalesProps> = ({ vehicles, expenses }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const expensesByVehicle = useMemo(() => {
        return expenses.reduce((acc, expense) => {
            acc[expense.vehicleId] = (acc[expense.vehicleId] || 0) + expense.amount;
            return acc;
        }, {} as { [key: string]: number });
    }, [expenses]);

    const monthlySalesData = useMemo(() => {
        const monthMap: { [key: string]: { name: string; sales: number } } = {};
        const today = new Date();

        // Initialize the last 12 months
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
            const monthName = d.toLocaleString('default', { month: 'short' });
            monthMap[monthKey] = { name: monthName, sales: 0 };
        }

        vehicles.forEach(vehicle => {
            if (vehicle.saleDate) {
                const saleDate = new Date(vehicle.saleDate);
                const monthKey = `${saleDate.getFullYear()}-${saleDate.getMonth()}`;
                if (monthMap[monthKey]) {
                    monthMap[monthKey].sales += 1;
                }
            }
        });
        
        return Object.values(monthMap);
    }, [vehicles]);


    const filteredSales = useMemo(() => {
        return vehicles.filter(sale => {
            const searchMatch = searchTerm === '' ||
                sale.brandModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (sale.buyerName && sale.buyerName.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const dateMatch = !dateFilter || sale.saleDate === dateFilter;

            return searchMatch && dateMatch;
        }).sort((a,b) => new Date(b.saleDate!).getTime() - new Date(a.saleDate!).getTime());
    }, [vehicles, searchTerm, dateFilter]);

    const totalProfit = useMemo(() => 
        vehicles.reduce((sum, v) => {
            const vehicleExpenses = expensesByVehicle[v.id] || 0;
            const profit = (v.sellingPrice || 0) - v.purchasePrice - vehicleExpenses;
            return sum + profit;
        }, 0),
    [vehicles, expensesByVehicle]);
    
    const inputClasses = "w-full pl-10 pr-4 py-3 text-base rounded-xl bg-gray-700 text-white border-2 border-gray-600 shadow-sm focus:outline-none focus:border-accent-500 placeholder:text-gray-400 transition-colors";

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Sales Report</h1>
                <div className="flex items-center gap-2 p-3 bg-brand-100 text-brand-700 rounded-lg">
                    <TrendingUp className="h-6 w-6" />
                    <div>
                        <p className="text-sm font-medium">Total Profit from {vehicles.length} sales</p>
                        <p className="font-bold text-lg">₹{totalProfit.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                 <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Pre-Owned Bike Sales</h2>
                 <SalesChart 
                    data={monthlySalesData} 
                    colors={{ bar: '#3b82f6', highlight: '#F59E0B' }} 
                 />
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 space-y-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Search sold bikes by model, number, buyer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={inputClasses} />
                </div>
                <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="date" placeholder="dd-mm-yyyy" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className={`${inputClasses} date-input`} />
                </div>
            </div>

            {filteredSales.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredSales.map(sale => {
                        const totalExpenses = expensesByVehicle[sale.id] || 0;
                        return <SaleCard key={sale.id} sale={sale} totalExpenses={totalExpenses} />;
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-500">No sales found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Sales;