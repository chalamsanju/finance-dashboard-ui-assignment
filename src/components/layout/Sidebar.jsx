import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { LayoutDashboard, Receipt, Settings, ArrowRightLeft, User, Shield } from 'lucide-react';
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { role } = useDashboard();
  
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col h-full bg-card border-r border-border">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <ArrowRightLeft className="w-6 h-6 text-indigo-500 mr-2" />
        <span className="font-bold text-lg tracking-tight">FinDash</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-500" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 bg-secondary p-3 rounded-xl border border-border/50">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            {role === 'admin' ? <Shield className="w-4 h-4 text-indigo-500"/> : <User className="w-4 h-4 text-indigo-500"/>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {role === 'admin' ? 'Superuser' : 'Sanjay Chalam'}
            </p>
            <p className="text-xs text-muted-foreground truncate capitalize">
              Role: {role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
