import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTransactions } from '../data/mockData';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchMockData = async () => {
      setIsLoading(true);
      // Simulate API network latency
      await new Promise(resolve => setTimeout(resolve, 800));
      const saved = localStorage.getItem('dashboard_transactions');
      if (saved) {
        setTransactions(JSON.parse(saved));
      } else {
        setTransactions(initialTransactions);
      }
      setIsInitialized(true);
      setIsLoading(false);
    };
    fetchMockData();
  }, []);

  const [role, setRole] = useState(() => {
    return localStorage.getItem('dashboard_role') || 'viewer';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('dashboard_theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Save to localStorage whenever state changes, but ONLY after initial fetch
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('dashboard_transactions', JSON.stringify(transactions));
    }
  }, [transactions, isInitialized]);

  useEffect(() => {
    localStorage.setItem('dashboard_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('dashboard_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Actions
  const addTransaction = (transaction) => {
    setTransactions(prev => [{ ...transaction, id: Date.now().toString() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleRole = () => setRole(prev => prev === 'admin' ? 'viewer' : 'admin');

  return (
    <DashboardContext.Provider value={{
      transactions,
      isLoading,
      addTransaction,
      deleteTransaction,
      role,
      toggleRole,
      isAdmin: role === 'admin',
      isDarkMode,
      toggleTheme
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
