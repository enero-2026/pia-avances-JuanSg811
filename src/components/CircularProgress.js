import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/colors';

const CircularProgress = ({
  size = 180,
  strokeWidth = 12,
  percentage = 0,
  currency = 'MXN',
  remaining = 0,
  total = 0,
  spent = 0,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  const getStrokeColor = () => {
    if (clampedPct > 90) return Colors.danger;
    if (clampedPct > 70) return Colors.warning;
    return Colors.accent;
  };

  const formatCurrency = (val) =>
    val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={getStrokeColor()} stopOpacity="1" />
            <Stop offset="100%" stopColor={Colors.primaryLight} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Track circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={clampedPct > 90 ? Colors.danger : 'url(#progressGrad)'}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        <Text style={styles.label}>Restante</Text>
        <Text style={[styles.amount, clampedPct > 90 && { color: Colors.danger }]}>
          {formatCurrency(remaining)}
        </Text>
        <Text style={styles.percentage}>{clampedPct.toFixed(0)}% gastado</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.accent,
    marginVertical: 2,
  },
  percentage: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});

export default CircularProgress;
