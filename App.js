import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';
import { useExpenses } from './src/hooks/useExpenses';
import { Colors } from './src/constants/colors';

export default function App() {
  const {
    expenses,
    budget,
    customCategories,
    loading,
    addExpense,
    deleteExpense,
    updateExpense,
    setBudget,
    addCategory,
  } = useExpenses();

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const expenseData = {
    expenses,
    budget,
    customCategories,
    onAdd: addExpense,
    onDelete: deleteExpense,
    onUpdate: updateExpense,
    setBudget,
    addCategory,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={Colors.background} />
        <AppNavigator expenseData={expenseData} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});