import React from 'react';
import { NavLink } from 'react-router-dom';
import type { NavItemType } from '../types';
import { LayoutDashboard, Tag, ShoppingCart, Wrench, Settings, X, Bike, Warehouse, CreditCard } from 'lucide-react';

const navItems: NavItemType[] = [
  { name: 'Dashboard', path: '/dashboard', icon: (props) => <LayoutDashboard {...props} /> },
  { name: 'Inventory', path: '/inventory', icon: (props) => <Warehouse {...props} /> },
  { name: 'Sales', path: '/sales', icon: (props) => <Tag {...props} /> },
  { name: 'Purchases', path: '/purchases', icon: (props) => <ShoppingCart {...props} /> },
  { name: 'Expenses', path: '/expenses', icon: (props) => <CreditCard {...props} /> },
  { name: 'Services', path: '/services', icon: (props) => <Wrench {...props} />, disabled: true },
  { name: 'Settings', path: '/settings', icon: (props) => <Settings {...props} />, disabled: true },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{ item: NavItemType; onClick: () => void; }> = ({ item, onClick }) => {
    const baseClasses = 'flex items-center px-4 py-3 text-gray-700 rounded-lg';
    const hoverClasses = 'hover:bg-brand-50 hover:text-brand-600';
    const activeClasses = 'bg-brand-500 text-white';
    const disabledClasses = 'opacity-50 cursor-not-allowed';

    if (item.disabled) {
      return (
        <div className={`${baseClasses} ${disabledClasses}`}>
          <item.icon className="h-5 w-5 mr-3" />
          <span>{item.name}</span>
        </div>
      );
    }
    
    return (
      <NavLink
        to={item.path}
        onClick={onClick}
        className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : hoverClasses}`}
      >
        <item.icon className="h-5 w-5 mr-3" />
        <span>{item.name}</span>
      </NavLink>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`absolute md:relative z-30 md:z-auto w-64 bg-white h-full flex-shrink-0 shadow-lg md:shadow-none transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Bike className="h-8 w-8 text-brand-500" />
            <h1 className="ml-2 text-xl font-bold text-gray-800">Roz Moto</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-800">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map(item => <li key={item.name}><NavItem item={item} onClick={() => setSidebarOpen(false)} /></li>)}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;