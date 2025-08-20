import React, { useState } from 'react';
import type { Vehicle, VehicleStatus } from '../types';

interface EditVehicleFormProps {
    vehicle: Vehicle;
    onUpdateVehicle: (vehicle: Vehicle) => void;
    closeModal: () => void;
}

const statusOptions: VehicleStatus[] = ['Available', 'Pending', 'Workshop', 'Sold'];

const EditVehicleForm: React.FC<EditVehicleFormProps> = ({ vehicle, onUpdateVehicle, closeModal }) => {
    // Keep form data as string-friendly for inputs
    const [formData, setFormData] = useState({
        ...vehicle,
        purchasePrice: String(vehicle.purchasePrice),
        purchaseBalance: String(vehicle.purchaseBalance ?? ''),
        isPartnership: vehicle.isPartnership ?? false,
        partnerName: vehicle.partnerName ?? '',
        sellingPrice: String(vehicle.sellingPrice ?? ''),
        saleBalance: String(vehicle.saleBalance ?? ''),
        notes: vehicle.notes ?? '',
        sellerAddress: vehicle.sellerAddress ?? '',
        purchaseBill: vehicle.purchaseBill ?? '',
        buyerName: vehicle.buyerName ?? '',
        buyerContact: vehicle.buyerContact ?? '',
        buyerPlace: vehicle.buyerPlace ?? '',
        buyerAddress: vehicle.buyerAddress ?? '',
        saleDate: vehicle.saleDate ?? '',
        saleBill: vehicle.saleBill ?? '',
        financierName: vehicle.financierName ?? '',
        financierAmount: String(vehicle.financierAmount ?? ''),
        financeCreditedDate: vehicle.financeCreditedDate ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? checked : value,
             // If unchecking partnership, clear partner name
            ...(name === 'isPartnership' && !checked && { partnerName: '' })
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.isPartnership && !formData.partnerName.trim()) {
            alert("Please enter the partner's name.");
            return;
        }

        let updatedVehicle: Vehicle = {
            ...formData,
            purchasePrice: Number(formData.purchasePrice),
            purchaseBalance: formData.purchaseBalance ? Number(formData.purchaseBalance) : undefined,
            isPartnership: formData.isPartnership,
            partnerName: formData.isPartnership ? formData.partnerName : undefined,
            sellingPrice: formData.sellingPrice ? Number(formData.sellingPrice) : undefined,
            saleBalance: formData.saleBalance ? Number(formData.saleBalance) : undefined,
            financierAmount: formData.financierAmount ? Number(formData.financierAmount) : undefined,
            financeCreditedDate: formData.financeCreditedDate || undefined,
            notes: formData.notes || undefined,
            sellerAddress: formData.sellerAddress || undefined,
            purchaseBill: formData.purchaseBill || undefined,
            buyerName: formData.buyerName || undefined,
            buyerContact: formData.buyerContact || undefined,
            buyerPlace: formData.buyerPlace || undefined,
            buyerAddress: formData.buyerAddress || undefined,
            saleDate: formData.saleDate || undefined,
            saleBill: formData.saleBill || undefined,
            financierName: formData.financierName || undefined,
        };

        // When status is changed to anything other than 'Sold', clear sales data.
        if (updatedVehicle.status !== 'Sold') {
            updatedVehicle.saleDate = undefined;
            updatedVehicle.sellingPrice = undefined;
            updatedVehicle.buyerName = undefined;
            updatedVehicle.buyerContact = undefined;
            updatedVehicle.buyerPlace = undefined;
            updatedVehicle.buyerAddress = undefined;
            updatedVehicle.saleBill = undefined;
            updatedVehicle.saleBalance = undefined;
            updatedVehicle.financierName = undefined;
            updatedVehicle.financierAmount = undefined;
            updatedVehicle.financeCreditedDate = undefined;
        }

        onUpdateVehicle(updatedVehicle);
        closeModal();
    };

    const inputBaseClass = "w-full text-base rounded-xl p-3 border-2 shadow-sm focus:outline-none focus:border-accent-500 placeholder:text-gray-400 transition-colors";
    const inputClass = `${inputBaseClass} bg-gray-700 text-white border-gray-600`;
    const disabledInputClass = `${inputBaseClass} bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed`;
    const labelClass = "block text-sm font-medium text-gray-400 mb-1";
    const sectionTitleClass = "text-lg font-semibold text-gray-300 mt-6 mb-3 pb-2 border-b border-gray-600 col-span-full";

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                
                {/* Non-editable details for reference */}
                <div>
                    <label htmlFor="brandModel" className={labelClass}>Brand & Model</label>
                    <input id="brandModel" type="text" value={formData.brandModel} className={disabledInputClass} disabled />
                </div>
                <div>
                    <label htmlFor="vehicleNumber" className={labelClass}>Vehicle Number</label>
                    <input id="vehicleNumber" type="text" value={formData.vehicleNumber} className={disabledInputClass} disabled />
                </div>
                 <div>
                    <label htmlFor="status" className={labelClass}>Status*</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} required className={inputClass}>
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className={sectionTitleClass}>Purchase Details</div>

                <div>
                    <label htmlFor="sellerName" className={labelClass}>Seller Name*</label>
                    <input id="sellerName" name="sellerName" type="text" value={formData.sellerName} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <label htmlFor="sellerContact" className={labelClass}>Seller Contact*</label>
                    <input id="sellerContact" name="sellerContact" type="text" value={formData.sellerContact} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <label htmlFor="sellerPlace" className={labelClass}>Seller Place*</label>
                    <input id="sellerPlace" name="sellerPlace" type="text" value={formData.sellerPlace} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                     <label htmlFor="purchaseDate" className={labelClass}>Purchase Date*</label>
                    <input id="purchaseDate" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} required className={`${inputClass} date-input`} />
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="sellerAddress" className={labelClass}>Seller Address</label>
                    <input id="sellerAddress" name="sellerAddress" type="text" value={formData.sellerAddress} onChange={handleChange} className={inputClass} />
                </div>
                
                <div>
                    <label htmlFor="purchasePrice" className={labelClass}>Purchase Price*</label>
                    <input id="purchasePrice" name="purchasePrice" type="number" step="any" value={formData.purchasePrice} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <label htmlFor="purchaseBalance" className={labelClass}>Balance to Seller</label>
                    <input id="purchaseBalance" name="purchaseBalance" type="number" step="any" value={formData.purchaseBalance} onChange={handleChange} className={inputClass} placeholder="0" />
                </div>

                <div>
                    <label htmlFor="purchaseBill" className={labelClass}>Purchase Bill No.</label>
                    <input id="purchaseBill" name="purchaseBill" type="text" value={formData.purchaseBill} onChange={handleChange} className={inputClass} />
                </div>
                
                <div className="md:col-span-2 flex items-center gap-3 mt-2">
                    <input
                        id="isPartnershipEdit"
                        name="isPartnership"
                        type="checkbox"
                        checked={formData.isPartnership}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-gray-500 bg-gray-600 text-accent-500 focus:ring-accent-500"
                    />
                    <label htmlFor="isPartnershipEdit" className="font-medium text-gray-300 select-none">
                        Purchased in Partnership?
                    </label>
                </div>
                {formData.isPartnership && (
                    <div className="md:col-span-2">
                        <label htmlFor="partnerName" className={labelClass}>Partner Name*</label>
                        <input
                            id="partnerName"
                            name="partnerName"
                            type="text"
                            value={formData.partnerName}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />
                    </div>
                )}

                {formData.status === 'Sold' && (
                    <>
                        <div className={sectionTitleClass}>Sale Details</div>
                        <div>
                            <label htmlFor="buyerName" className={labelClass}>Buyer Name</label>
                            <input id="buyerName" name="buyerName" type="text" value={formData.buyerName} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="buyerContact" className={labelClass}>Buyer Contact</label>
                            <input id="buyerContact" name="buyerContact" type="text" value={formData.buyerContact} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="buyerPlace" className={labelClass}>Buyer Place</label>
                            <input id="buyerPlace" name="buyerPlace" type="text" value={formData.buyerPlace} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="saleDate" className={labelClass}>Sale Date</label>
                            <input id="saleDate" name="saleDate" type="date" value={formData.saleDate} onChange={handleChange} className={`${inputClass} date-input`} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="buyerAddress" className={labelClass}>Buyer Address</label>
                            <input id="buyerAddress" name="buyerAddress" type="text" value={formData.buyerAddress} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="sellingPrice" className={labelClass}>Selling Price</label>
                            <input id="sellingPrice" name="sellingPrice" type="number" step="any" value={formData.sellingPrice} onChange={handleChange} className={inputClass} placeholder="0" />
                        </div>
                         <div>
                            <label htmlFor="saleBalance" className={labelClass}>Balance from Buyer</label>
                            <input id="saleBalance" name="saleBalance" type="number" step="any" value={formData.saleBalance} onChange={handleChange} className={inputClass} placeholder="0" />
                        </div>
                        <div>
                            <label htmlFor="saleBill" className={labelClass}>Sale Bill No.</label>
                            <input id="saleBill" name="saleBill" type="text" value={formData.saleBill} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="financierName" className={labelClass}>Financier Name</label>
                            <input id="financierName" name="financierName" type="text" value={formData.financierName} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="financierAmount" className={labelClass}>Financier Amount</label>
                            <input id="financierAmount" name="financierAmount" type="number" step="any" value={formData.financierAmount} onChange={handleChange} className={inputClass} placeholder="0" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="financeCreditedDate" className={labelClass}>Finance Credit Date</label>
                            <input id="financeCreditedDate" name="financeCreditedDate" type="date" value={formData.financeCreditedDate} onChange={handleChange} className={`${inputClass} date-input`} />
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end pt-8 space-x-3">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-medium text-gray-300 bg-gray-600 rounded-xl hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-3 font-bold text-white bg-accent-600 rounded-xl hover:bg-accent-700 transition-colors shadow-lg">Save Changes</button>
            </div>
        </form>
    );
};

export default EditVehicleForm;