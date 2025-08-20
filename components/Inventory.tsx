import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Vehicle, VehicleStatus, Expense } from '../types';
import { Search, ChevronDown, ChevronUp, Image as ImageIcon, Tag, Edit, Wrench, CalendarDays } from 'lucide-react';
import Modal from './Modal';
import EditVehicleForm from './EditVehicleForm';

const statusColors: { [key in VehicleStatus]: string } = {
    Available: 'bg-brand-100 text-brand-700',
    Sold: 'bg-gray-200 text-gray-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Workshop: 'bg-accent-100 text-accent-700',
};

const VehicleCard: React.FC<{ vehicle: Vehicle; totalExpenses: number; onAction: (action: 'sell' | 'edit' | 'workshop', vehicle: Vehicle) => void }> = ({ vehicle, totalExpenses, onAction }) => {
    const [isExpanded, setExpanded] = useState(false);

    const profit = vehicle.status === 'Sold' ? (vehicle.sellingPrice || 0) - vehicle.purchasePrice - totalExpenses : null;
    const totalAmountSpent = vehicle.purchasePrice + totalExpenses;

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 transition-shadow hover:shadow-lg">
            <div className="flex items-center p-4 cursor-pointer" onClick={() => setExpanded(!isExpanded)}>
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-grow">
                    <p className="font-bold text-brand-500 text-lg truncate">{vehicle.brandModel}</p>
                    <p className="text-sm text-gray-500">{vehicle.vehicleNumber}</p>
                </div>
                <div className="flex items-center ml-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[vehicle.status]}`}>
                        {vehicle.status}
                    </span>
                    <button className="p-1 ml-2 text-gray-500 hover:text-gray-800">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                        
                        <div className="md:col-span-2 font-bold text-gray-700 text-base mb-2 pb-2 border-b">Seller Details</div>
                        <div><span className="font-semibold">Seller:</span> {vehicle.sellerName} ({vehicle.sellerContact})</div>
                        <div><span className="font-semibold">Place:</span> {vehicle.sellerPlace}</div>
                        <div className="md:col-span-2"><span className="font-semibold">Address:</span> {vehicle.sellerAddress || 'N/A'}</div>
                        <div><span className="font-semibold">Purchase Date:</span> {new Date(vehicle.purchaseDate).toLocaleDateString()}</div>
                        <div><span className="font-semibold">Bill No:</span> {vehicle.purchaseBill || 'N/A'}</div>

                        <div className="md:col-span-2 font-bold text-gray-700 text-base mt-4 mb-2 pb-2 border-b">Financial Summary</div>
                        
                        <div className="space-y-2 md:col-span-2 bg-white p-4 rounded-lg border">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-600">Purchase Price:</span>
                                <span className="font-medium text-gray-800">₹{vehicle.purchasePrice.toLocaleString()}</span>
                            </div>
                             {(vehicle.purchaseBalance ?? 0) > 0 && 
                                <div className="flex justify-between items-center text-xs pl-4">
                                    <span className="text-gray-500">Balance to Seller:</span>
                                    <span className="font-bold text-red-500">₹{(vehicle.purchaseBalance || 0).toLocaleString()}</span>
                                </div>
                            }
                            {totalExpenses > 0 &&
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-600">Total Expenses:</span>
                                    <span className="font-medium text-gray-800">₹{totalExpenses.toLocaleString()}</span>
                                </div>
                            }
                            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t mt-2">
                                <span className="text-red-600">Total Amount Spent:</span>
                                <span className="text-red-600">₹{totalAmountSpent.toLocaleString()}</span>
                            </div>

                            {vehicle.status === 'Sold' && (
                                <>
                                    <div className="flex justify-between items-center text-lg font-bold pt-2 border-t mt-2">
                                        <span className="text-brand-600">Amount Released:</span>
                                        <span className="text-brand-600">₹{(vehicle.sellingPrice || 0).toLocaleString()}</span>
                                    </div>
                                     {(vehicle.saleBalance ?? 0) > 0 && 
                                        <div className="flex justify-between items-center text-xs pl-4">
                                            <span className="text-gray-500">Balance from Buyer:</span>
                                            <span className="font-bold text-red-500">₹{(vehicle.saleBalance || 0).toLocaleString()}</span>
                                        </div>
                                    }
                                    <div className="flex justify-between items-center text-xl font-bold pt-2 border-t mt-2">
                                        <span className={profit && profit >= 0 ? 'text-brand-700' : 'text-red-700'}>Final Profit:</span>
                                        <span className={profit && profit >= 0 ? 'text-brand-700' : 'text-red-700'}>
                                            ₹{profit?.toLocaleString()}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {vehicle.isPartnership && (
                            <div className="md:col-span-2 font-semibold text-accent-600 mt-2">
                                <span className="text-gray-800">Partnership Purchase w/:</span> {vehicle.partnerName}
                            </div>
                        )}
                        
                        {vehicle.status === 'Sold' && (
                            <>
                                <div className="md:col-span-2 font-bold text-gray-700 text-base mt-4 mb-2 pb-2 border-b">Buyer Details</div>
                                <div><span className="font-semibold">Buyer:</span> {vehicle.buyerName} ({vehicle.buyerContact})</div>
                                <div><span className="font-semibold">Place:</span> {vehicle.buyerPlace}</div>
                                <div className="md:col-span-2"><span className="font-semibold">Address:</span> {vehicle.buyerAddress || 'N/A'}</div>
                                <div><span className="font-semibold">Sale Date:</span> {vehicle.saleDate ? new Date(vehicle.saleDate).toLocaleDateString() : 'N/A'}</div>
                                <div><span className="font-semibold">Bill No:</span> {vehicle.saleBill || 'N/A'}</div>
                                {vehicle.financierName && <div><span className="font-semibold">Financier:</span> {vehicle.financierName}</div>}
                                {(vehicle.financierAmount ?? 0) > 0 && <div><span className="font-semibold">Financed Amount:</span> <span className="font-bold text-brand-600">₹{(vehicle.financierAmount || 0).toLocaleString()}</span></div>}
                                {vehicle.financeCreditedDate && <div><span className="font-semibold">Finance Credited:</span> {new Date(vehicle.financeCreditedDate).toLocaleDateString()}</div>}
                            </>
                        )}
                        {vehicle.notes && <div className="col-span-full italic text-gray-600 pt-2"><span className="font-semibold not-italic text-gray-800">Notes:</span> {vehicle.notes}</div>}
                    </div>
                    <div className="flex justify-end items-center gap-2 pt-4 mt-4 border-t">
                        {vehicle.status === 'Available' && (
                             <button onClick={() => onAction('sell', vehicle)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600">
                                <Tag size={14} /> Sell
                            </button>
                        )}
                         {vehicle.status !== 'Sold' && (
                            <button onClick={() => onAction('workshop', vehicle)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-accent-500 rounded-md hover:bg-accent-600">
                                <Wrench size={14} /> To Workshop
                            </button>
                         )}
                        <button onClick={() => onAction('edit', vehicle)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700">
                            <Edit size={14} /> Edit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SellForm: React.FC<{ vehicle: Vehicle; onUpdateVehicle: (vehicle: Vehicle) => void; closeModal: () => void; }> = ({ vehicle, onUpdateVehicle, closeModal }) => {
    const [formData, setFormData] = useState({
        buyerName: '',
        buyerContact: '',
        buyerPlace: '',
        buyerAddress: '',
        saleDate: new Date().toISOString().split('T')[0],
        sellingPrice: '',
        saleBill: '',
        saleBalance: '',
        financierName: '',
        financierAmount: '',
        financeCreditedDate: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(p => ({...p, [name]: value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateVehicle({
            ...vehicle,
            ...formData,
            sellingPrice: Number(formData.sellingPrice),
            saleBalance: Number(formData.saleBalance) || undefined,
            financierName: formData.financierName || undefined,
            financierAmount: Number(formData.financierAmount) || undefined,
            financeCreditedDate: formData.financeCreditedDate || undefined,
            status: 'Sold'
        });
        closeModal();
    }
    
    const inputClass = "w-full text-base rounded-xl p-3 border-2 border-gray-600 bg-gray-700 text-white shadow-sm focus:outline-none focus:border-accent-500 placeholder:text-gray-400 transition-colors";

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-gray-700 rounded-md text-sm text-gray-300">
                <strong>Selling Vehicle:</strong> {vehicle.brandModel} ({vehicle.vehicleNumber})
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="buyerName" type="text" placeholder="Buyer Name*" value={formData.buyerName} onChange={handleChange} required className={inputClass} />
                <input name="buyerContact" type="text" placeholder="Buyer Contact*" value={formData.buyerContact} onChange={handleChange} required className={inputClass} />
                <input name="buyerPlace" type="text" placeholder="Buyer Place*" value={formData.buyerPlace} onChange={handleChange} required className={inputClass} />
                <input name="buyerAddress" type="text" placeholder="Buyer Address (Optional)" value={formData.buyerAddress} onChange={handleChange} className={inputClass} />
                <input name="sellingPrice" type="number" placeholder="Selling Price*" value={formData.sellingPrice} onChange={handleChange} required className={inputClass} />
                <input name="saleDate" type="date" placeholder="Sale Date*" value={formData.saleDate} onChange={handleChange} required className={`${inputClass} date-input`} />
                <input name="saleBill" type="text" placeholder="Bill Number (Optional)" value={formData.saleBill} onChange={handleChange} className={inputClass} />
                <input name="saleBalance" type="number" placeholder="Balance to be Received (Optional)" value={formData.saleBalance} onChange={handleChange} className={inputClass} />
                <input name="financierName" type="text" placeholder="Financier Name (Optional)" value={formData.financierName} onChange={handleChange} className={inputClass} />
                <input name="financierAmount" type="number" placeholder="Financier Amount (Optional)" value={formData.financierAmount} onChange={handleChange} className={inputClass} />
                <div className="md:col-span-2">
                    <input name="financeCreditedDate" type="date" value={formData.financeCreditedDate} onChange={handleChange} className={`${inputClass} date-input`} title="Finance Credit Date"/>
                </div>
            </div>
            <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-medium text-gray-300 bg-gray-600 rounded-xl hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-6 py-3 font-bold text-white bg-accent-600 rounded-xl hover:bg-accent-700 shadow-lg">Confirm Sale</button>
            </div>
        </form>
    );
}


interface InventoryProps {
    vehicles: Vehicle[];
    expenses: Expense[];
    onUpdateVehicle: (vehicle: Vehicle) => void;
}

const Inventory: React.FC<InventoryProps> = ({ vehicles, expenses, onUpdateVehicle }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'All'>(() => (searchParams.get('status') as VehicleStatus) || 'All');
    const [dateFilter, setDateFilter] = useState('');
    
    const [activeModal, setActiveModal] = useState<'sell' | 'edit' | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const handleAction = (action: 'sell' | 'edit' | 'workshop', vehicle: Vehicle) => {
        if (action === 'workshop') {
            onUpdateVehicle({...vehicle, status: 'Workshop'});
            return;
        }
        setSelectedVehicle(vehicle);
        setActiveModal(action);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedVehicle(null);
    }
    
    const filteredVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const statusMatch = statusFilter === 'All' || v.status === statusFilter;
            const searchMatch = searchTerm === '' ||
                v.brandModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (v.buyerName && v.buyerName.toLowerCase().includes(searchTerm.toLowerCase()));
            const dateMatch = !dateFilter || v.purchaseDate === dateFilter || v.saleDate === dateFilter;

            return statusMatch && searchMatch && dateMatch;
        });
    }, [vehicles, searchTerm, statusFilter, dateFilter]);

    const handleFilterChange = (status: VehicleStatus | 'All') => {
        setStatusFilter(status);
        if (status === 'All') {
            searchParams.delete('status');
        } else {
            searchParams.set('status', status);
        }
        setSearchParams(searchParams);
    }

    const handleUpdateAndCloseModal = (vehicle: Vehicle) => {
        onUpdateVehicle(vehicle);
        closeModal();
    };
    
    const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-600 bg-gray-700 text-white shadow-sm focus:outline-none focus:border-accent-500 placeholder:text-gray-400 transition-colors"

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Vehicle Inventory ({filteredVehicles.length})</h1>
                <button onClick={() => navigate('/purchases')} className="flex items-center gap-2 px-4 py-2 text-white bg-brand-500 rounded-lg shadow-md hover:bg-brand-600 transition">
                    Add New Vehicle
                </button>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="text" placeholder="Search by model, number, name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={inputClass} />
                    </div>
                     <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="date" placeholder="Filter by date..." value={dateFilter} onChange={e => setDateFilter(e.target.value)} className={`${inputClass} date-input`} />
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {(['All', 'Available', 'Sold', 'Pending', 'Workshop'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => handleFilterChange(status)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${statusFilter === status ? 'bg-accent-600 text-white' : 'bg-gray-500 text-gray-300 hover:bg-gray-500'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
            
            {filteredVehicles.length > 0 ? (
                <div className="space-y-4">
                    {filteredVehicles.map(vehicle => {
                        const totalExpenses = expenses
                            .filter(e => e.vehicleId === vehicle.id)
                            .reduce((sum, e) => sum + e.amount, 0);
                        return <VehicleCard key={vehicle.id} vehicle={vehicle} onAction={handleAction} totalExpenses={totalExpenses}/>;
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-500">No vehicles found matching your criteria.</p>
                </div>
            )}
            
            {selectedVehicle && (
                <Modal isOpen={activeModal === 'sell'} onClose={closeModal} title="Record a New Sale">
                    <SellForm vehicle={selectedVehicle} onUpdateVehicle={onUpdateVehicle} closeModal={closeModal} />
                </Modal>
            )}

            {selectedVehicle && (
                <Modal isOpen={activeModal === 'edit'} onClose={closeModal} title="Edit Vehicle">
                   <EditVehicleForm vehicle={selectedVehicle} onUpdateVehicle={handleUpdateAndCloseModal} closeModal={closeModal} />
                </Modal>
            )}

        </div>
    );
};

export default Inventory;