import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { DEFAULT_CATEGORIES, getCategoryById } from '../constants/categories';
import CircularProgress from '../components/CircularProgress';
import StatCard from '../components/StatCard';
import SectionHeader from '../components/SectionHeader';
import FAB from '../components/FAB';

const DashboardScreen = ({ navigation, expenses, budget, customCategories, loading }) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthNames = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
  ];

  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpent = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget.monthly - totalSpent;
  const percentage = (totalSpent / budget.monthly) * 100;

  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysPassed = now.getDate();
  const dailyAvg = daysPassed > 0 ? totalSpent / daysPassed : 0;
  const projected = dailyAvg * lastDay;

  const expensesByCategory = currentMonthExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];
  const topCategories = allCategories
    .filter((c) => expensesByCategory[c.id])
    .sort((a, b) => expensesByCategory[b.id] - expensesByCategory[a.id])
    .slice(0, 4);

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const formatCurrency = (val) =>
    val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola! 👋</Text>
            <Text style={styles.monthLabel}>{monthNames[currentMonth]} {currentYear}</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Main balance card */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardLabel}>Presupuesto mensual</Text>
              <Text style={styles.totalBudget}>{formatCurrency(budget.monthly)}</Text>
            </View>
            <TouchableOpacity
              style={styles.editBudgetBtn}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="pencil-outline" size={14} color={Colors.primary} />
              <Text style={styles.editBudgetText}>Editar</Text>
            </TouchableOpacity>
          </View>

          {/* Circular progress */}
          <View style={styles.progressRow}>
            <CircularProgress
              size={175}
              strokeWidth={13}
              percentage={percentage}
              remaining={remaining}
              total={budget.monthly}
              spent={totalSpent}
            />

            <View style={styles.progressDetails}>
              <View style={styles.detailItem}>
                <View style={[styles.dot, { backgroundColor: Colors.danger }]} />
                <View>
                  <Text style={styles.detailLabel}>Gastado</Text>
                  <Text style={styles.detailValue}>{formatCurrency(totalSpent)}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailItem}>
                <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
                <View>
                  <Text style={styles.detailLabel}>Proyectado</Text>
                  <Text style={[styles.detailValue, { color: projected > budget.monthly ? Colors.danger : Colors.textPrimary }]}>
                    {formatCurrency(projected)}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailItem}>
                <View style={[styles.dot, { backgroundColor: Colors.accent }]} />
                <View>
                  <Text style={styles.detailLabel}>Diario</Text>
                  <Text style={styles.detailValue}>{formatCurrency(dailyAvg)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard
            title="Gastos del mes"
            value={currentMonthExpenses.length.toString()}
            icon="receipt-outline"
            color={Colors.primary}
          />
          <View style={{ width: 10 }} />
          <StatCard
            title="Días restantes"
            value={`${lastDay - daysPassed}d`}
            icon="calendar-outline"
            color={Colors.accent}
          />
          <View style={{ width: 10 }} />
          <StatCard
            title="Promedio diario"
            value={formatCurrency(dailyAvg)}
            icon="trending-up-outline"
            color={Colors.warning}
          />
        </View>

        {/* Categories summary */}
        {topCategories.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Este mes"
              action="Ver todo"
              onAction={() => navigation.navigate('Charts')}
            />
            {topCategories.map((cat) => {
              const catAmount = expensesByCategory[cat.id] || 0;
              const catPct = totalSpent > 0 ? (catAmount / totalSpent) * 100 : 0;
              return (
                <View key={cat.id} style={styles.categoryRow}>
                  <View style={[styles.catIcon, { backgroundColor: cat.bgColor }]}>
                    <Ionicons name={cat.icon} size={16} color={cat.color} />
                  </View>
                  <View style={styles.catInfo}>
                    <View style={styles.catTitleRow}>
                      <Text style={styles.catName}>{cat.name}</Text>
                      <Text style={styles.catAmount}>{formatCurrency(catAmount)}</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${catPct}%`, backgroundColor: cat.color },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Recent transactions */}
        {recentExpenses.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Recientes"
              action="Ver todos"
              onAction={() => navigation.navigate('Expenses')}
            />
            {recentExpenses.map((expense) => {
              const cat = getCategoryById(expense.category, customCategories);
              return (
                <View key={expense.id} style={styles.txRow}>
                  <View style={[styles.catIcon, { backgroundColor: cat.bgColor }]}>
                    <Ionicons name={cat.icon} size={16} color={cat.color} />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txDesc} numberOfLines={1}>
                      {expense.description || cat.name}
                    </Text>
                    <Text style={styles.txDate}>{formatDate(expense.date)}</Text>
                  </View>
                  <Text style={styles.txAmount}>-{formatCurrency(expense.amount)}</Text>
                </View>
              );
            })}
          </View>
        )}

        {expenses.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Sin gastos registrados</Text>
            <Text style={styles.emptySubtitle}>
              Presiona el botón + para agregar tu primer gasto
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <FAB onPress={() => navigation.navigate('AddExpense')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  monthLabel: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  mainCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4, fontWeight: '500' },
  totalBudget: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  editBudgetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '18',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  editBudgetText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressDetails: { flex: 1, paddingLeft: 16, gap: 2 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  detailLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 2 },
  detailValue: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border },

  statsRow: { flexDirection: 'row', marginBottom: 20 },

  section: { marginBottom: 20 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  catIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catInfo: { flex: 1 },
  catTitleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catName: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  catAmount: { fontSize: 13, color: Colors.textPrimary, fontWeight: '700' },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: 4, borderRadius: 2 },

  txRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  txInfo: { flex: 1 },
  txDesc: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  txDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },

  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary },
  emptySubtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', maxWidth: 240 },
});

export default DashboardScreen;
