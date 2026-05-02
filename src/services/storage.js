import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  EXPENSES: '@expense_tracker:expenses',
  BUDGET: '@expense_tracker:budget',
  CATEGORIES: '@expense_tracker:custom_categories',
  SETTINGS: '@expense_tracker:settings',
};

// Expenses

export const saveExpenses = async (expenses) => {
  try {
    await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
    return true;
  } catch (e) {
    console.error('Error saving expenses:', e);
    return false;
  }
};

export const loadExpenses = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading expenses:', e);
    return [];
  }
};

export const addExpense = async (expense) => {
  const expenses = await loadExpenses();
  const updated = [expense, ...expenses];
  await saveExpenses(updated);
  return updated;
};

export const deleteExpense = async (id) => {
  const expenses = await loadExpenses();
  const updated = expenses.filter((e) => e.id !== id);
  await saveExpenses(updated);
  return updated;
};

export const updateExpense = async (id, updates) => {
  const expenses = await loadExpenses();
  const updated = expenses.map((e) => (e.id === id ? { ...e, ...updates } : e));
  await saveExpenses(updated);
  return updated;
};

// Budget

export const saveBudget = async (budget) => {
  try {
    await AsyncStorage.setItem(KEYS.BUDGET, JSON.stringify(budget));
    return true;
  } catch (e) {
    console.error('Error saving budget:', e);
    return false;
  }
};

export const loadBudget = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.BUDGET);
    return data ? JSON.parse(data) : { monthly: 10000, currency: 'MXN' };
  } catch (e) {
    return { monthly: 10000, currency: 'MXN' };
  }
};

// Custom Categories

export const saveCustomCategories = async (categories) => {
  try {
    await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    return true;
  } catch (e) {
    return false;
  }
};

export const loadCustomCategories = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// Settings

export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    return false;
  }
};

export const loadSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { darkMode: true, currency: 'MXN' };
  } catch (e) {
    return { darkMode: true, currency: 'MXN' };
  }
};

// Utilities

export const clearAll = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return true;
  } catch (e) {
    return false;
  }
};

export const exportData = async () => {
  const expenses = await loadExpenses();
  const budget = await loadBudget();
  const customCategories = await loadCustomCategories();
  return { expenses, budget, customCategories, exportedAt: new Date().toISOString() };
};
