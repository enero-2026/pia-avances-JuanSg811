import { useState, useEffect, useCallback } from 'react';
import {
  loadExpenses,
  addExpense as addExpenseStorage,
  deleteExpense as deleteExpenseStorage,
  updateExpense as updateExpenseStorage,
  loadBudget,
  saveBudget,
  loadCustomCategories,
  saveCustomCategories,
} from '../services/storage';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudgetState] = useState({ monthly: 10000, currency: 'MXN' });
  const [customCategories, setCustomCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all data on mount
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [exp, bdg, cats] = await Promise.all([
        loadExpenses(),
        loadBudget(),
        loadCustomCategories(),
      ]);
      setExpenses(exp);
      setBudgetState(bdg);
      setCustomCategories(cats);
      setLoading(false);
    };
    init();
  }, []);

  const addExpense = useCallback(async (expense) => {
    const updated = await addExpenseStorage(expense);
    setExpenses(updated);
  }, []);

  const deleteExpense = useCallback(async (id) => {
    const updated = await deleteExpenseStorage(id);
    setExpenses(updated);
  }, []);

  const updateExpense = useCallback(async (id, updates) => {
    const updated = await updateExpenseStorage(id, updates);
    setExpenses(updated);
  }, []);

  const setBudget = useCallback(async (newBudget) => {
    await saveBudget(newBudget);
    setBudgetState(newBudget);
  }, []);

  const addCategory = useCallback(async (category) => {
    const updated = [...customCategories, category];
    await saveCustomCategories(updated);
    setCustomCategories(updated);
  }, [customCategories]);

  // ─── Computed Values ───────────────────────────────────────────────────────

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpentThisMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.monthly - totalSpentThisMonth;
  const spentPercentage = Math.min((totalSpentThisMonth / budget.monthly) * 100, 100);

  // Days remaining in month
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysRemaining = lastDay - now.getDate();
  const daysPassed = now.getDate();
  const dailyAvgSpent = daysPassed > 0 ? totalSpentThisMonth / daysPassed : 0;
  const projectedSpend = dailyAvgSpent * lastDay;

  // Expenses by category this month
  const expensesByCategory = currentMonthExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  // Group expenses by date
  const expensesByDate = expenses.reduce((acc, e) => {
    const dateKey = new Date(e.date).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(e);
    return acc;
  }, {});

  return {
    expenses,
    currentMonthExpenses,
    budget,
    customCategories,
    loading,
    totalSpentThisMonth,
    remaining,
    spentPercentage,
    daysRemaining,
    projectedSpend,
    expensesByCategory,
    expensesByDate,
    addExpense,
    deleteExpense,
    updateExpense,
    setBudget,
    addCategory,
  };
};
