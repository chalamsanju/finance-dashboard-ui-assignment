import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Search, Plus, ArrowUpDown, Download } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { CATEGORIES } from '../../data/mockData';

const TransactionsList = () => {
  const { transactions, role, addTransaction, deleteTransaction } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [quickMacro, setQuickMacro] = useState('all'); // specific advanced filter
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter & Sort
  const processedTransactions = transactions
    .filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      
      let matchesMacro = true;
      if (quickMacro === 'highValue') matchesMacro = t.amount >= 10000;
      if (quickMacro === 'recent') {
        const diffDays = (new Date() - new Date(t.date)) / (1000 * 3600 * 24);
        matchesMacro = diffDays <= 7 && diffDays >= 0;
      }

      return matchesSearch && matchesType && matchesMacro;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const val = new Date(b.date) - new Date(a.date);
        return sortOrder === 'desc' ? val : -val;
      }
      if (sortBy === 'amount') {
        const val = b.amount - a.amount;
        return sortOrder === 'desc' ? val : -val;
      }
      return 0;
    });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Add Transaction Form State
  const [formData, setFormData] = useState({
    description: '', amount: '', category: CATEGORIES[0], type: 'expense', date: new Date().toISOString().split('T')[0]
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setIsAddModalOpen(false);
    setFormData({ description: '', amount: '', category: CATEGORIES[0], type: 'expense', date: new Date().toISOString().split('T')[0] });
  };

  const exportToCSV = () => {
    // Wow Factor: CSV Export
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)'];
    const csvContent = processedTransactions.map(tx => {
      const typeStr = tx.type === 'income' ? 'Income' : 'Expense';
      return `${format(parseISO(tx.date), 'yyyy-MM-dd')},"${tx.description}","${tx.category}","${typeStr}",${tx.amount}`;
    });
    
    const blob = new Blob([headers.join(',') + '\n' + csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "finance_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
            <CardTitle>Transactions</CardTitle>
            
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {/* Export & Admin Add Button */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1 bg-secondary hover:bg-secondary/80 text-foreground border border-border px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              title="Export visible data to CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {role === 'admin' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            )}
            </div>
          </div>

          {/* Quick Macros Row */}
          <div className="flex gap-2 pt-2 border-t border-border overflow-x-auto pb-1 scrollbar-none w-full">
             <button 
                onClick={() => setQuickMacro('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${quickMacro === 'all' ? 'bg-indigo-500 text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
             >
                All Data
             </button>
             <button 
                onClick={() => setQuickMacro('highValue')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${quickMacro === 'highValue' ? 'bg-indigo-500 text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
             >
                High Value {`> ₹10,000`}
             </button>
             <button 
                onClick={() => setQuickMacro('recent')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${quickMacro === 'recent' ? 'bg-indigo-500 text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
             >
                Past 7 Days
             </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort('date')}>
                      <div className="flex items-center">Date <ArrowUpDown className="ml-1 w-3 h-3" /></div>
                    </th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground text-right" onClick={() => toggleSort('amount')}>
                      <div className="flex items-center justify-end">Amount <ArrowUpDown className="ml-1 w-3 h-3" /></div>
                    </th>
                    {role === 'admin' && <th className="px-4 py-3 font-medium text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {processedTransactions.length > 0 ? (
                    processedTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                          {format(parseISO(tx.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-4 py-3 font-medium">{tx.description}</td>
                        <td className="px-4 py-3">
                          <span className="bg-secondary px-2.5 py-0.5 rounded-full text-xs text-muted-foreground">
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                            tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${
                          tx.type === 'income' ? 'text-emerald-500' : 'text-foreground'
                        }`}>
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </td>
                        {role === 'admin' && (
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => deleteTransaction(tx.id)}
                              className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={role === 'admin' ? 6 : 5} className="px-4 py-8 text-center text-muted-foreground">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-lg">Add Transaction</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <input 
                  type="text" required
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <input 
                    type="number" required min="0" step="0.01"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input 
                    type="date" required
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select 
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
