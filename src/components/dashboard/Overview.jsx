import React, { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'];

const Overview = () => {
  const { transactions } = useDashboard();

  // Calculations for Summary
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.totalIncome += curr.amount;
        acc.balance += curr.amount;
      } else {
        acc.totalExpense += curr.amount;
        acc.balance -= curr.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0, balance: 0 });
  }, [transactions]);

  // Calculations for Time-based Chart (Last 7 Days trend for Demo)
  const chartData = useMemo(() => {
    // Grouping by date
    const grouped = transactions.reduce((acc, curr) => {
      const date = curr.date;
      if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
      if (curr.type === 'income') acc[date].income += curr.amount;
      else acc[date].expense += curr.amount;
      return acc;
    }, {});
    
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date)).map(item => ({
      ...item,
      displayDate: format(parseISO(item.date), 'MMM dd')
    }));
  }, [transactions]);

  // Calculations for Categorical Chart (Expenses by Category)
  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // sort by highest
  }, [transactions]);

  const highestCategory = pieData.length > 0 ? pieData[0] : { name: 'N/A', value: 0 };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
            <div className="p-2 bg-indigo-500/20 rounded-full">
              <Wallet className="w-4 h-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">₹<AnimatedCounter value={balance} /></div>
            <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <div className="p-2 bg-emerald-500/20 rounded-full">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-500">₹<AnimatedCounter value={totalIncome} /></div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <div className="p-2 bg-rose-500/20 rounded-full">
              <TrendingDown className="w-4 h-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-rose-500">₹<AnimatedCounter value={totalExpense} /></div>
            <p className="text-xs text-muted-foreground mt-1">+4.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* 2 & 3. Charts Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Time-based Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cash Flow Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="displayDate" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categorical Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
               {pieData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={pieData}
                       cx="50%"
                       cy="45%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="none"
                     >
                       {pieData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                        formatter={(value) => `₹${value}`}
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                      />
                     <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                   </PieChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="text-muted-foreground">No expenses recorded</div>
               )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights & Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="border border-border p-4 rounded-xl bg-secondary/50">
              <div className="text-sm text-muted-foreground mb-1">Highest Spending Category</div>
              <div className="font-semibold text-lg">{highestCategory.name}</div>
              <div className="text-xs text-rose-500 mt-1">₹{highestCategory.value} total</div>
            </div>
            <div className="border border-border p-4 rounded-xl bg-secondary/50">
              <div className="text-sm text-muted-foreground mb-1">Savings Rate</div>
              <div className="font-semibold text-lg">
                {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Based on global income</div>
            </div>
            <div className="border border-border p-4 rounded-xl bg-secondary/50 sm:col-span-2 md:col-span-1">
              <div className="text-sm text-muted-foreground mb-1">Observation</div>
              <div className="font-medium text-sm leading-snug text-foreground">
                {totalExpense > totalIncome ? 
                  "You are spending more than you earn. Consider reviewing top expenses." : 
                  "Great job! Your income exceeds your expenses, contributing to your balance."}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
