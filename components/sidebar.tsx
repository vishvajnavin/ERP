"use client"
import React from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, ShoppingCart, ClipboardList, History, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/context/user-context';
import Image from 'next/image';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const userContext = useUser();
  const user = userContext?.user;
  const signOut = userContext?.signOut;

  const getInitials = (name?: string) => {
    if (!name || name.trim() === '') return 'U';
    const names = name.trim().split(/\s+/);
    if (names.length > 1 && names[1]) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return (names[0][0] || '').toUpperCase();
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: "/dashboard", roles: ['admin', 'manager'] },
    { name: 'Customers', icon: Users, href: "/customers", roles: ['admin', 'manager', 'sales coordinator'] },
    { name: 'Products', icon: Package, href: "/products", roles: ['admin', 'manager', 'sales coordinator'] },
    { name: 'Place Order', icon: ShoppingCart, href: "/place-order", roles: ['admin', 'manager', 'sales coordinator'] },
    { name: 'View Orders', icon: ClipboardList, href: "/view-orders", roles: ['admin', 'manager', 'production manager'] },
    { name: 'Order History', icon: History, href: "/order-history", roles: ['admin', 'manager'] },
    { name: 'Employees', icon: Users, href: "/employees", roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => user?.role && item.roles.includes(user.role));

  if (filteredMenuItems.length < 1) {
    return null;
  }

  return (
    <aside
      className={`flex flex-col bg-black text-white transition-all duration-300 ease-in-out h-[calc(100vh-2rem)] sticky top-4 left-4 z-10 rounded-3xl shadow-2xl ${
        isCollapsed ? 'w-20' : 'w-64'
      } m-4`}
    >
      {/* --- Header --- */}
      <div className="flex items-center justify-start h-20 border-gray-800 pt-4 px-4">
        <div className={`flex items-center justify-start transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
          <Image src="/Vinyork_Logo.png" alt="Vinyork Logo" className="h-12 w-auto" />
          <span className="text-white text-4xl ml-2 uppercase font-bold" style={{ fontFamily: 'Mainlux, sans-serif' }}>vinyork</span>
        </div>
         <div className={`flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <Image src="/Vinyork_Logo.png" alt="Vinyork Logo" className="h-12 w-auto" />
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

      {user && (
        <div className="p-4 border-t border-gray-800">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 text-lg p-1">
              {getInitials(user?.full_name)}
            </div>
            <div
              className={`ml-4 transition-all duration-200 ease-in-out ${
                isCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible w-auto'
              }`}
            >
              <p className="font-semibold text-white whitespace-nowrap">{user?.full_name ?? 'User'}</p>
              <p className="text-sm text-gray-400 whitespace-nowrap truncate">{user?.email}</p>
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
