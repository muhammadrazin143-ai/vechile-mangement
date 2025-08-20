
import React from 'react';
import { Menu, Search, User } from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, onSearch }) => {
  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between p-2 sm:p-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="relative ml-2 sm:ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search by name, number, status..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-48 sm:w-64 lg:w-96 pl-10 pr-4 py-2 rounded-xl border-2 border-gray-600 bg-gray-700 text-white shadow-sm focus:outline-none focus:border-accent-500 placeholder:text-gray-400 transition"
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-brand-500">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;