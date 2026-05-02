import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import ExpenseListScreen from '../screens/ExpenseListScreen';
import ChartsScreen from '../screens/ChartsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator
const TabNavigator = ({ expenseData }) => {
  const { expenses, budget, customCategories, onAdd, onDelete, addCategory, setBudget } = expenseData;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Expenses') iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Charts') iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          else if (route.name === 'Categories') iconName = focused ? 'grid' : 'grid-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" options={{ tabBarLabel: 'Inicio' }}>
        {(props) => (
          <DashboardScreen
            {...props}
            expenses={expenses}
            budget={budget}
            customCategories={customCategories}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Expenses" options={{ tabBarLabel: 'Gastos' }}>
        {(props) => (
          <ExpenseListScreen
            {...props}
            expenses={expenses}
            onDelete={onDelete}
            customCategories={customCategories}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Charts" options={{ tabBarLabel: 'Análisis' }}>
        {(props) => (
          <ChartsScreen
            {...props}
            expenses={expenses}
            budget={budget}
            customCategories={customCategories}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Categories" options={{ tabBarLabel: 'Categorías' }}>
        {(props) => (
          <CategoriesScreen
            {...props}
            expenses={expenses}
            customCategories={customCategories}
            onAddCategory={addCategory}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Root Stack
const AppNavigator = ({ expenseData }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {(props) => <TabNavigator {...props} expenseData={expenseData} />}
        </Stack.Screen>

        <Stack.Screen
          name="AddExpense"
          options={{
            presentation: 'modal',
            gestureEnabled: true,
          }}
        >
          {(props) => (
            <AddExpenseScreen
              {...props}
              onAdd={expenseData.onAdd}
              customCategories={expenseData.customCategories}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Settings">
          {(props) => (
            <SettingsScreen
              {...props}
              budget={expenseData.budget}
              onSetBudget={expenseData.setBudget}
              expenses={expenseData.expenses}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
