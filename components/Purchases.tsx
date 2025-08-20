
import React, { useState } from 'react';
import type { Vehicle } from '../types';
import { PlusCircle } from 'lucide-react';
import Modal from './Modal';

interface PurchasesProps {
  onAddVehicle: (vehicle: Omit<Vehicle, 'id' | 'status'>) => void;
}

const AddPurchaseForm: React.FC<{ onAddVehicle: PurchasesProps['onAddVehicle'], closeModal: () => void }> = ({ onAddVehicle, closeModal }) => {
    const [formData, setFormData] = useState({
        brandModel: '',
        vehicleNumber: '',
        sellerName: '',
        sellerContact: '',
        sellerPlace: '',
        sellerAddress: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        purchasePrice: '',
        purchaseBill: '',
        purchaseBalance: '',
        isPartnership: false,
        partnerName: '',
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: isCheckbox ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.brandModel || !formData.vehicleNumber || !formData.sellerName || !formData.purchasePrice || !formData.sellerPlace) {
            alert('Please fill all required fields');
            return;
        }
        if (formData.isPartnership && !formData.partnerName.trim()) {
            alert("Please provide the partner's name.");
            return;
        }
        onAddVehicle({
            ...formData,
            purchasePrice: Number(formData.purchasePrice),
            purchaseBalance: Number(formData.purchaseBalance) || undefined,
            partnerName: formData.isPartnership ? formData.partnerName : undefined,
        });
        closeModal();
    };

    const inputClasses = "w-full text-base rounded-xl p-3 border-2 border-gray-600 bg-gray-700 text-white shadow-sm focus:outline-none focus:border-accent-500 placeholder:text-gray-400 transition-colors";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <input name="brandModel" type="text" placeholder="Bike Brand & Model*" value={formData.brandModel} onChange={handleChange} required className={inputClasses} />
                <input name="vehicleNumber" type="text" placeholder="Vehicle Number*" value={formData.vehicleNumber} onChange={handleChange} required className={inputClasses} />
                <input name="sellerName" type="text" placeholder="Seller Name*" value={formData.sellerName} onChange={handleChange} required className={inputClasses} />
                <input name="sellerContact" type="text" placeholder="Seller Contact*" value={formData.sellerContact} onChange={handleChange} required className={inputClasses} />
                <input name="sellerPlace" type="text" placeholder="Seller Place*" value={formData.sellerPlace} onChange={handleChange} required className={inputClasses} />
                <input name="sellerAddress" type="text" placeholder="Seller Address (Optional)" value={formData.sellerAddress} onChange={handleChange} className={inputClasses} />
                <input name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} required className={`${inputClasses} date-input`} />
                <input name="purchasePrice" type="number" placeholder="Price Paid*" value={formData.purchasePrice} onChange={handleChange} required className={inputClasses} />
                <input name="purchaseBill" type="text" placeholder="Bill Number (Optional)" value={formData.purchaseBill} onChange={handleChange} className={inputClasses} />
                <input name="purchaseBalance" type="number" placeholder="Balance to be Given (Optional)" value={formData.purchaseBalance} onChange={handleChange} className={inputClasses} />
            </div>
            <div className="border-t border-gray-700 pt-5 space-y-4">
                <div className="flex items-center gap-3">
                    <input
                        id="isPartnership"
                        name="isPartnership"
                        type="checkbox"
                        checked={formData.isPartnership}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-gray-500 bg-gray-600 text-accent-500 focus:ring-accent-500"
                    />
                    <label htmlFor="isPartnership" className="font-medium text-white select-none">
                        Purchased in Partnership?
                    </label>
                </div>
                {formData.isPartnership && (
                    <input
                        name="partnerName"
                        type="text"
                        placeholder="Partner's Name*"
                        value={formData.partnerName}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    />
                )}
            </div>
            <textarea name="notes" placeholder="Optional notes (e.g., condition, repairs needed)" value={formData.notes} onChange={handleChange} className={`${inputClasses} min-h-[90px]`} rows={3}></textarea>
            <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-medium text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-3 font-bold text-white bg-accent-600 rounded-xl hover:bg-accent-700 transition-colors shadow-lg">Add to Stock</button>
            </div>
        </form>
    );
};

const Purchases: React.FC<PurchasesProps> = ({ onAddVehicle }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Add Purchase</h1>
                <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-white bg-brand-500 rounded-lg shadow-md hover:bg-brand-600 transition">
                    <PlusCircle className="h-5 w-5" />
                    <span>Add New Stock</span>
                </button>
            </div>
            
            <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="p-4 bg-brand-100 rounded-full inline-block">
                     <PlusCircle className="h-12 w-12 text-brand-500" />
                </div>
                <h2 className="mt-6 text-xl font-semibold text-gray-700">Ready to add a new bike?</h2>
                <p className="mt-2 text-gray-500">Click the "Add New Stock" button to enter the details of a new purchase.</p>
                <button onClick={() => setModalOpen(true)} className="mt-6 flex mx-auto items-center gap-2 px-6 py-3 text-white bg-brand-500 rounded-lg shadow-md hover:bg-brand-600 transition">
                    <PlusCircle className="h-5 w-5" />
                    <span>Add New Stock</span>
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Purchase">
                <AddPurchaseForm onAddVehicle={onAddVehicle} closeModal={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Purchases;