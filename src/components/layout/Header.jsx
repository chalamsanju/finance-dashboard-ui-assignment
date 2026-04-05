import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Moon, Sun, Menu, Bell, CheckCircle2 } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const { role, toggleRole, isDarkMode, toggleTheme } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 px-6 border-b border-border bg-card flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="md:hidden mr-4 p-2 text-muted-foreground hover:bg-secondary rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-foreground tracking-tight hidden sm:block">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Role Toggle */}
        <div className="flex items-center bg-secondary rounded-full p-1 border border-border">
          <button
            onClick={() => role !== 'viewer' && toggleRole()}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
              role === 'viewer' 
                ? 'bg-background shadow-sm text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Viewer
          </button>
          <button
            onClick={() => role !== 'admin' && toggleRole()}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
              role === 'admin' 
                ? 'bg-background shadow-sm text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-full transition-colors"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-full transition-colors relative hidden sm:block"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-card" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 hidden sm:block">
              <div className="px-4 py-3 border-b border-border bg-secondary/50 flex justify-between items-center">
                <span className="font-semibold text-sm">Notifications</span>
                <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-4 border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-full h-fit flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Salary Received</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Your monthly salary of ₹50,000 has been credited successfully.</p>
                      <p className="text-xs text-muted-foreground mt-1.5 opacity-75">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="p-1.5 bg-rose-500/10 text-rose-500 rounded-full h-fit flex-shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Unusual Spending Detected</p>
                      <p className="text-xs text-muted-foreground mt-0.5">You've spent more on Utilities this month compared to last month.</p>
                      <p className="text-xs text-muted-foreground mt-1.5 opacity-75">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t border-border text-center bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer text-indigo-500 font-medium text-xs">
                Mark all as read
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
