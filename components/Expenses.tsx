
import React, { useState, useMemo } from 'react';
import type { Vehicle, Expense } from '../types';
import { PlusCircle, CreditCard, Plus, ChevronDown, ChevronUp, Image as ImageIcon, CalendarDays, Edit, Search } from 'lucide-react';
import Modal from './Modal';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (expense: Expense) => void;
  closeModal: () => void;
  vehicles: Vehicle[];
  selectedVehicleIdForNew: string | null;
  expenseToEdit: Expense | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, onUpdateExpense, closeModal, vehicles, selectedVehicleIdForNew, expenseToEdit }) => {
    const isEditing = !!expenseToEdit;

    const [formData, setFormData] = useState(() => {
        const initialData = {
            vehicleId: selectedVehicleIdForNew || '',
            amount: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
        };
        if (isEditing && expenseToEdit) {
            return {
                vehicleId: expenseToEdit.vehicleId,
                amount: String(expenseToEdit.amount),
                description: expenseToEdit.description || '',
                date: expenseToEdit.date,
            };
        }
        return initialData;
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.vehicleId || !formData.amount || !formData.date || Number(formData.amount) <= 0) {
            alert('Please select a vehicle, enter a valid amount, and set the date.');
            return;
        }

        const expenseData = {
            ...formData,
            amount: Number(formData.amount),
            description: formData.description || undefined,
        };

        if (isEditing && expenseToEdit) {
            onUpdateExpense({ ...expenseToEdit, ...expenseData });
        } else {
            onAddExpense(expenseData);
        }
        closeModal();
    };

    const inputBaseClass = "w-full text-base rounded-xl p-3 border-2 shadow-sm focus:outline-none focus:border-accent-500 placeholder:text-gray-400 transition-colors";
    const inputClasses = `${inputBaseClass} bg-gray-700 text-white border-gray-600`;
    const disabledInputClasses = `${inputBaseClass} bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed`;
    const dateInputClasses = `${inputClasses} date-input`;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
             <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} required className={isEditing ? disabledInputClasses : inputClasses} disabled={isEditing}>
                <option value="" disabled>Select a Vehicle*</option>
                {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                        {v.brandModel} ({v.vehicleNumber})
                    </option>
                ))}
            </select>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <input name="amount" type="number" placeholder="Amount*" value={formData.amount} onChange={handleChange} required className={inputClasses} step="any" min="0.01" />
                <input name="date" type="date" value={formData.date} onChange={handleChange} required className={dateInputClasses} />
            </div>
            <textarea name="description" placeholder="Optional description (e.g., fuel, service)" value={formData.description} onChange={handleChange} className={`${inputClasses} min-h-[90px]`} rows={3}></textarea>
            <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-medium text-gray-300 bg-gray-600 rounded-xl hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-3 font-bold text-white bg-accent-600 rounded-xl hover:bg-accent-700 transition-colors shadow-lg">
                    {isEditing ? 'Save Changes' : 'Add Expense'}
                </button>
            </div>
        </form>
    );
};

const VehicleExpenseCard: React.FC<{ vehicle: Vehicle; expenses: Expense[]; onAdd: (vehicleId: string) => void; onEdit: (expense: Expense) => void; }> = ({ vehicle, expenses, onAdd, onEdit }) => {
    const [isExpanded, setExpanded] = useState(false);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 transition-shadow hover:shadow-lg">
            <div className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-grow">
                     <p className="font-bold text-brand-500 text-lg truncate">{vehicle.brandModel}</p>
                     <p className="text-sm text-gray-500">{vehicle.vehicleNumber}</p>
                     <p className="text-sm text-gray-500 mt-1">Total Spent: <span className="font-semibold text-gray-700">₹{totalExpenses.toLocaleString()}</span></p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => onAdd(vehicle.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                        <Plus size={14} /> Add
                    </button>
                    <button onClick={() => setExpanded(!isExpanded)} className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                    {expenses.length > 0 ? (
                        <ul className="space-y-1 pt-3">
                            {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
                                <li key={expense.id} className="group flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-700">{expense.description || 'Expense'}</p>
                                        <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-800">₹{expense.amount.toLocaleString()}</p>
                                        <button onClick={() => onEdit(expense)} className="p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                                            <Edit size={14} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-sm text-gray-500 py-4">No expenses recorded for this period.</p>
                    )}
                </div>
            )}
        </div>
    );
};

interface ExpensesProps {
  vehicles: Vehicle[];
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (expense: Expense) => void;
}

type FilterType = 'all' | 'today' | 'week' | 'month' | 'custom';
const filterOptions: { key: Exclude<FilterType, 'custom'>, label: string }[] = [
    { key: 'month', label: 'This Month' },
    { key: 'week', label: 'This Week' },
    { key: 'today', label: 'Today' },
    { key: 'all', label: 'All Time' },
];

const Expenses: React.FC<ExpensesProps> = ({ vehicles, expenses, onAddExpense, onUpdateExpense }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');
    const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddExpenseClick = (vehicleId: string | null) => {
        setExpenseToEdit(null);
        setSelectedVehicleId(vehicleId);
        setModalOpen(true);
    };

    const handleEditExpenseClick = (expense: Expense) => {
        setExpenseToEdit(expense);
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedVehicleId(null);
        setExpenseToEdit(null);
    };

    const handleFilterClick = (key: Exclude<FilterType, 'custom'>) => {
        setFilter(key);
        setCustomDateRange({ start: '', end: '' });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomDateRange(prev => {
            const newRange = { ...prev, [name]: value };
            if (newRange.start || newRange.end) {
                setFilter('custom');
            } else {
                setFilter('all');
            }
            return newRange;
        });
    };

    const globallyFilteredExpenses = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return expenses.filter(e => {
            const expenseDate = new Date(e.date);
            const localExpenseDate = new Date(expenseDate.getUTCFullYear(), expenseDate.getUTCMonth(), expenseDate.getUTCDate());

            if (filter === 'custom') {
                const { start, end } = customDateRange;
                if (start && e.date < start) return false;
                if (end && e.date > end) return false;
                return true;
            }

            switch (filter) {
                case 'today':
                    return localExpenseDate.getTime() === today.getTime();
                case 'week': {
                    const firstDayOfWeek = new Date(today);
                    firstDayOfWeek.setDate(today.getDate() - today.getDay());
                    return localExpenseDate >= firstDayOfWeek;
                }
                case 'month': {
                    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    return localExpenseDate >= firstDayOfMonth;
                }
                case 'all':
                default:
                    return true;
            }
        });
    }, [expenses, filter, customDateRange]);
    
    const filteredVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const term = searchTerm.toLowerCase().trim();
            if (!term) return true;
            return v.brandModel.toLowerCase().includes(term) ||
                   v.vehicleNumber.toLowerCase().includes(term);
        });
    }, [vehicles, searchTerm]);

    const totalFilteredExpense = useMemo(() => {
        const vehicleIds = filteredVehicles.map(v => v.id);
        return globallyFilteredExpenses
            .filter(e => vehicleIds.includes(e.vehicleId))
            .reduce((sum, expense) => sum + expense.amount, 0);
    }, [globallyFilteredExpenses, filteredVehicles]);

    const getFilterLabel = () => {
        if (filter === 'custom') return 'Custom Range';
        return filterOptions.find(f => f.key === filter)?.label ?? 'Total';
    };
    
    const searchInputClass = "w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-600 bg-gray-700 text-white shadow-sm focus:outline-none focus:border-accent-500 placeholder:text-gray-400";

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
                <button onClick={() => handleAddExpenseClick(null)} className="flex items-center gap-2 px-4 py-2 text-white bg-brand-500 rounded-lg shadow-md hover:bg-brand-600 transition">
                    <PlusCircle className="h-5 w-5" />
                    <span>Add New Expense</span>
                </button>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 text-brand-400">
                         <div className="p-3 bg-brand-900/50 rounded-full">
                            <CreditCard className="h-6 w-6" />
                         </div>
                         <div>
                            <p className="text-sm font-medium text-gray-400">Total Expenses ({getFilterLabel()})</p>
                            <p className="font-bold text-2xl text-white">₹{totalFilteredExpense.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {filterOptions.map(({key, label}) => (
                            <button
                                key={key}
                                onClick={() => handleFilterClick(key)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === key ? 'bg-accent-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                    <div className="relative">
                        <label htmlFor="expenseSearch" className="text-sm font-medium text-gray-400 mb-1 block">Search Vehicle</label>
                        <Search className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                        <input
                            id="expenseSearch"
                            type="text"
                            placeholder="Name or number..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={searchInputClass}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="startDate" className="text-sm font-medium text-gray-400 mb-1 block">From Date</label>
                        <CalendarDays className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                        <input 
                            id="startDate" type="date" name="start"
                            value={customDateRange.start} onChange={handleDateChange} 
                            className={`${searchInputClass} date-input`} />
                    </div>
                    <div className="relative">
                        <label htmlFor="endDate" className="text-sm font-medium text-gray-400 mb-1 block">To Date</label>
                        <CalendarDays className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                        <input
                            id="endDate" type="date" name="end"
                            value={customDateRange.end} onChange={handleDateChange} 
                            className={`${searchInputClass} date-input`} />
                    </div>
                </div>
            </div>

            {filteredVehicles.length > 0 ? (
                <div className="space-y-4">
                    {filteredVehicles.map(vehicle => (
                         <VehicleExpenseCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            expenses={globallyFilteredExpenses.filter(e => e.vehicleId === vehicle.id)}
                            onAdd={handleAddExpenseClick}
                            onEdit={handleEditExpenseClick}
                         />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="p-4 bg-gray-100 rounded-full inline-block">
                         <Search className="h-12 w-12 text-gray-500" />
                    </div>
                    <h2 className="mt-6 text-xl font-semibold text-gray-700">No Vehicles Found</h2>
                    <p className="mt-2 text-gray-500">No vehicles match your current search term. Try a different search.</p>
                </div>
            )}


            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={expenseToEdit ? 'Edit Expense' : 'Add New Expense'}>
                <ExpenseForm
                    onAddExpense={onAddExpense}
                    onUpdateExpense={onUpdateExpense}
                    closeModal={handleCloseModal}
                    vehicles={vehicles}
                    selectedVehicleIdForNew={selectedVehicleId}
                    expenseToEdit={expenseToEdit}
                />
            </Modal>
        </div>
    );
};

export default Expenses;