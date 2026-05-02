import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

const StatCard = ({ title, value, icon, color = Colors.primary, trend }) => (
  <View style={styles.card}>
    <View style={[styles.iconWrap, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.title}>{title}</Text>
    {trend != null && (
      <View style={styles.trendRow}>
        <Ionicons
          name={trend >= 0 ? 'trending-up' : 'trending-down'}
          size={12}
          color={trend >= 0 ? Colors.danger : Colors.success}
        />
        <Text style={[styles.trend, { color: trend >= 0 ? Colors.danger : Colors.success }]}>
          {Math.abs(trend).toFixed(0)}%
        </Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  title: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  trend: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default StatCard;
