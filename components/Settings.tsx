
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="p-6 bg-brand-100 rounded-full">
                <SettingsIcon className="h-16 w-16 text-brand-500" />
            </div>
            <h1 className="mt-8 text-3xl font-bold text-gray-800">Settings</h1>
            <p className="mt-4 max-w-md text-gray-600">
                Application settings and customization options will be available here in a future update. You'll be able to manage user roles, integrations, and more.
            </p>
        </div>
    );
};

export default Settings;