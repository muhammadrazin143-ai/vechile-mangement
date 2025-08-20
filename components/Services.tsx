
import React from 'react';
import { Wrench } from 'lucide-react';

const Services: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="p-6 bg-brand-100 rounded-full">
                <Wrench className="h-16 w-16 text-brand-500" />
            </div>
            <h1 className="mt-8 text-3xl font-bold text-gray-800">Services & Workshop</h1>
            <p className="mt-4 max-w-md text-gray-600">
                This section is under construction. Soon you'll be able to track workshop activities, polishing, and service statuses right here.
            </p>
        </div>
    );
};

export default Services;