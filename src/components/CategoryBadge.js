import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

const CategoryBadge = ({ category, selected, onPress, showAmount, amount }) => {
  const formatCurrency = (val) =>
    val?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }) ?? '';

  return (
    <TouchableOpacity
      style={[
        styles.badge,
        { backgroundColor: selected ? category.color + '25' : Colors.card },
        selected && { borderColor: category.color, borderWidth: 1 },
      ]}
      onPress={() => onPress?.(category)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrap, { backgroundColor: category.bgColor }]}>
        <Ionicons name={category.icon} size={16} color={category.color} />
      </View>
      <Text style={[styles.name, selected && { color: category.color }]}>{category.name}</Text>
      {showAmount && amount != null && (
        <Text style={[styles.amount, { color: category.color }]}>{formatCurrency(amount)}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  amount: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
});

export default CategoryBadge;
