import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { Vehicle, SearchResult, VehicleStatus, Expense } from './types';
import { useVehicles } from './hooks/useVehicles';
import { useExpenses } from './hooks/useExpenses';
import { useVehicles } from './hooks/useVehicles';
import { useExpenses } from './hooks/useExpenses';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Sales from './components/Sales';
import Purchases from './components/Purchases';
import Expenses from './components/Expenses';
import Services from './components/Services';
import Settings from './components/Settings';
import Inventory from './components/Inventory';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const statusColors: { [key in VehicleStatus]: string } = {
    Available: 'bg-brand-100 text-brand-700',
    Sold: 'bg-gray-200 text-gray-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Workshop: 'bg-accent-100 text-accent-700',
};

const SearchResultsDisplay: React.FC<{ results: SearchResult[] }> = ({ results }) => (
    <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Search Results ({results.length})</h1>
        {results.length > 0 ? (
            <div className="space-y-4">
                {results.map(result => (
                    <div key={`${result.type}-${result.data.id}`} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-brand-500 text-lg">{result.data.brandModel}</p>
                                <p className="text-sm text-gray-500">{result.data.vehicleNumber}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[result.data.status]}`}>
                                {result.data.status}
                            </span>
                        </div>
                        {result.data.buyerName && (
                            <p className="text-sm mt-2">Buyer: <span className="font-medium">{result.data.buyerName}</span></p>
                        )}
                        {result.data.sellerName && (
                             <p className="text-sm mt-2">Seller: <span className="font-medium">{result.data.sellerName}</span></p>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10">
                <p className="text-gray-500">No results found.</p>
            </div>
        )}
    </div>
);

export default function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');

    const { vehicles, loading: vehiclesLoading, error: vehiclesError, addVehicle, updateVehicle } = useVehicles();
    const { expenses, loading: expensesLoading, error: expensesError, addExpense, updateExpense } = useExpenses();

    const loading = vehiclesLoading || expensesLoading;
    const error = vehiclesError || expensesError;

    const { vehicles, loading: vehiclesLoading, error: vehiclesError, addVehicle, updateVehicle } = useVehicles();
    const { expenses, loading: expensesLoading, error: expensesError, addExpense, updateExpense } = useExpenses();

    const loading = vehiclesLoading || expensesLoading;
    const error = vehiclesError || expensesError;

    // Show loading spinner while data is being fetched
    if (loading) {
        return <LoadingSpinner />;
    }

    // Show error message if there's an error
    // Show loading spinner while data is being fetched
    if (loading) {
        return <LoadingSpinner />;
    }

    // Show error message if there's an error
    if (error) {
        return <ErrorMessage message={error} />;
    }

    const searchResults = useMemo<SearchResult[]>(() => {
        if (!globalSearchTerm.trim()) return [];
        const term = globalSearchTerm.toLowerCase();
        
        const matchingVehicles: SearchResult[] = vehicles
            .filter(v => 
                v.brandModel.toLowerCase().includes(term) ||
                v.vehicleNumber.toLowerCase().includes(term) ||
                v.sellerName.toLowerCase().includes(term) ||
                (v.buyerName && v.buyerName.toLowerCase().includes(term)) ||
                v.status.toLowerCase().includes(term)
            )
            .map(v => ({ type: v.status, data: v, path: '/inventory' }));

        return matchingVehicles;
    }, [globalSearchTerm, vehicles]);

    return (
        <HashRouter>
            <div className="h-screen flex bg-gray-100 font-sans">
                <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header setSidebarOpen={setSidebarOpen} onSearch={setGlobalSearchTerm} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto">
                        {globalSearchTerm.trim() ? (
                            <SearchResultsDisplay results={searchResults} />
                        ) : (
                           <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<Dashboard vehicles={vehicles} expenses={expenses} />} />
                                <Route path="/inventory" element={<Inventory vehicles={vehicles} expenses={expenses} onUpdateVehicle={updateVehicle} />} />
                                <Route path="/sales" element={<Sales vehicles={vehicles.filter(v => v.status === 'Sold')} expenses={expenses} />} />
                                <Route path="/purchases" element={<Purchases onAddVehicle={addVehicle} />} />
                                <Route path="/expenses" element={<Expenses vehicles={vehicles} expenses={expenses} onAddExpense={addExpense} onUpdateExpense={updateExpense} />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/settings" element={<Settings />} />
                            </Routes>
                        )}
                    </main>
                </div>
            </div>
        </HashRouter>
    );
}