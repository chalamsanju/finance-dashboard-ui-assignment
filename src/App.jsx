import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './components/dashboard/Overview';
import TransactionsList from './components/transactions/TransactionsList';
import { useDashboard } from './context/DashboardContext';
import { LayoutDashboard, Receipt } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const { isLoading } = useDashboard();

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-indigo-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground text-sm font-medium animate-pulse">Fetching latest data...</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && <Overview />}
                {activeTab === 'transactions' && <TransactionsList />}
              </>
            )}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden border-t border-border bg-card flex justify-around items-center h-16 px-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] relative z-50">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center space-y-1 w-full h-full ${activeTab === 'overview' ? 'text-indigo-500' : 'text-muted-foreground'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center justify-center space-y-1 w-full h-full ${activeTab === 'transactions' ? 'text-indigo-500' : 'text-muted-foreground'}`}
          >
            <Receipt className="w-5 h-5" />
            <span className="text-[10px] font-medium">Transactions</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
