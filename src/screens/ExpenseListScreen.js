import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { DEFAULT_CATEGORIES, getCategoryById } from '../constants/categories';
import ExpenseCard from '../components/ExpenseCard';
import FAB from '../components/FAB';

const ExpenseListScreen = ({ navigation, expenses, onDelete, customCategories = [] }) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('date_desc');

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

  const filtered = useMemo(() => {
    let list = [...expenses];
    if (filterCategory !== 'all') {
      list = list.filter((e) => e.category === filterCategory);
    }
    switch (sortOrder) {
      case 'date_desc': list.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case 'date_asc': list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case 'amount_desc': list.sort((a, b) => b.amount - a.amount); break;
      case 'amount_asc': list.sort((a, b) => a.amount - b.amount); break;
    }
    return list;
  }, [expenses, filterCategory, sortOrder]);

  // Group by month
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = { label, items: [], total: 0 };
      groups[key].items.push(e);
      groups[key].total += e.amount;
    });
    return Object.values(groups).sort((a, b) => {
      const [ayear, amonth] = a.label.split('-');
      const [byear, bmonth] = b.label.split('-');
      return 0; // already ordered by date sort
    });
  }, [filtered]);

  const formatCurrency = (val) =>
    val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis gastos</Text>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() =>
            setSortOrder((prev) => {
              const opts = ['date_desc', 'date_asc', 'amount_desc', 'amount_asc'];
              const idx = opts.indexOf(prev);
              return opts[(idx + 1) % opts.length];
            })
          }
        >
          <Ionicons name="swap-vertical-outline" size={18} color={Colors.primary} />
          <Text style={styles.sortText}>
            {sortOrder === 'date_desc' ? 'Fecha ↓' :
             sortOrder === 'date_asc' ? 'Fecha ↑' :
             sortOrder === 'amount_desc' ? 'Monto ↓' : 'Monto ↑'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, filterCategory === 'all' && styles.filterChipActive]}
          onPress={() => setFilterCategory('all')}
        >
          <Text style={[styles.filterText, filterCategory === 'all' && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        {allCategories.map((cat) => {
          const active = filterCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.filterChip, active && { backgroundColor: cat.color + '22', borderColor: cat.color }]}
              onPress={() => setFilterCategory(active ? 'all' : cat.id)}
            >
              <Ionicons name={cat.icon} size={13} color={active ? cat.color : Colors.textSecondary} />
              <Text style={[styles.filterText, active && { color: cat.color, fontWeight: '700' }]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Total */}
      {filtered.length > 0 && (
        <View style={styles.totalBar}>
          <Text style={styles.totalLabel}>{filtered.length} gastos</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalFiltered)}</Text>
        </View>
      )}

      {/* List */}
      <FlatList
        data={grouped}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={52} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Sin gastos</Text>
            <Text style={styles.emptySub}>
              {filterCategory !== 'all'
                ? 'No hay gastos en esta categoría'
                : 'Comienza agregando un gasto'}
            </Text>
          </View>
        }
        renderItem={({ item: group }) => (
          <View style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupLabel}>{group.label}</Text>
              <Text style={styles.groupTotal}>{formatCurrency(group.total)}</Text>
            </View>
            {group.items.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onDelete={onDelete}
                customCategories={customCategories}
              />
            ))}
          </View>
        )}
      />

      <FAB onPress={() => navigation.navigate('AddExpense')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortText: { fontSize: 12, fontWeight: '600', color: Colors.primary },

  filterScroll: { maxHeight: 50 },
  filterContent: { paddingHorizontal: 20, gap: 8, paddingBottom: 4 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary + '22', borderColor: Colors.primary },
  filterText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  filterTextActive: { color: Colors.primary, fontWeight: '700' },

  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  totalLabel: { fontSize: 13, color: Colors.textSecondary },
  totalAmount: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },

  listContent: { padding: 20, paddingBottom: 100 },

  group: { marginBottom: 20 },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  groupTotal: { fontSize: 13, fontWeight: '700', color: Colors.primary },

  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
});

export default ExpenseListScreen;
