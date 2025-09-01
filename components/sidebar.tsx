"use client"
import React from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, ShoppingCart, ClipboardList, History, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/context/user-context';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const userContext = useUser();
  const user = userContext?.user;
  const signOut = userContext?.signOut;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: "/dashboard", roles: ['admin', 'manager'] },
    { name: 'Customers', icon: Users, href: "/customers", roles: ['admin', 'manager', 'sales coordinator'] },
    { name: 'Products', icon: Package, href: "/products", roles: ['admin', 'manager', 'sales coordinator'] },
    { name: 'Place Order', icon: ShoppingCart, href: "/place-order", roles: ['admin', 'manager', 'sales coordinator'] },
    { name: 'View Orders', icon: ClipboardList, href: "/view-orders", roles: ['admin', 'manager', 'production manager'] },
    { name: 'Order History', icon: History, href: "/order-history", roles: ['admin', 'manager'] },
  ];

  const filteredMenuItems = menuItems.filter(item => user?.role && item.roles.includes(user.role));

  return (
    <aside
      className={`flex flex-col bg-black text-white transition-all duration-300 ease-in-out h-screen sticky top-0 z-10 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* --- Header --- */}
      <div className="flex items-center justify-center h-20 border-b border-gray-800">
        <div className={`flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
           <svg className="h-8 w-auto text-red-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
          </svg>
          <span className="ml-3 text-xl font-bold whitespace-nowrap">ERP System</span>
        </div>
         <div className={`flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <svg className="h-8 w-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
            </svg>
        </div>
      </div>

      {/* --- Collapse/Expand Button --- */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-transform duration-300"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* --- Navigation Menu --- */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.name}
            href={item?.href}
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
              pathname === item.href
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? item.name : ''}
          >
            <item.icon className={`h-6 w-6 ${isCollapsed ? '' : 'mr-4'}`} />
            <span
              className={`font-medium transition-all duration-200 ease-in-out whitespace-nowrap ${
                isCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible w-auto'
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* --- Footer --- */}
      {user && (
        <div className="p-4 border-t border-gray-800">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <Image
              src="https://placehold.co/40x40/ffffff/111827?text=U"
              alt="User Avatar"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div
              className={`ml-4 transition-all duration-200 ease-in-out ${
                isCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible w-auto'
              }`}
            >
              <p className="font-semibold text-white whitespace-nowrap">{user?.full_name ?? 'User'}</p>
              <p className="text-sm text-gray-400 whitespace-nowrap">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className={`flex items-center p-3 mt-4 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-gray-800 hover:text-white w-full ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className={`h-6 w-6 ${isCollapsed ? '' : 'mr-4'}`} />
            <span
              className={`font-medium transition-all duration-200 ease-in-out whitespace-nowrap ${
                isCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible w-auto'
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      )}
    </aside>
  );
};
