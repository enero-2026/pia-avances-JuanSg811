import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { getCategoryById } from '../constants/categories';

const ExpenseCard = ({ expense, onDelete, onPress, customCategories = [] }) => {
  const category = getCategoryById(expense.category, customCategories);

  const formatCurrency = (val) =>
    val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
  };

  const handleDelete = () => {
    Alert.alert('Eliminar gasto', '¿Estás seguro de eliminar este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(expense.id) },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(expense)}
      activeOpacity={0.85}
    >
      {/* Category icon */}
      <View style={[styles.iconContainer, { backgroundColor: category.bgColor }]}>
        <Ionicons name={category.icon} size={20} color={category.color} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>
          {expense.description || category.name}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.categoryTag, { color: category.color }]}>{category.name}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.date}>{formatDate(expense.date)}</Text>
        </View>
      </View>

      {/* Amount & Delete */}
      <View style={styles.right}>
        <Text style={styles.amount}>-{formatCurrency(expense.amount)}</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="trash-outline" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: '500',
  },
  dot: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  deleteBtn: {
    padding: 2,
  },
});

export default ExpenseCard;
