import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { exportData, clearAll } from '../services/storage';

const SettingsScreen = ({ navigation, budget, onSetBudget, expenses }) => {
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.monthly.toString());

  const handleSaveBudget = async () => {
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val <= 0) {
      Alert.alert('Error', 'Ingresa un presupuesto válido mayor a 0');
      return;
    }
    await onSetBudget({ ...budget, monthly: val });
    setEditingBudget(false);
    Alert.alert('✅ Listo', 'Presupuesto actualizado correctamente');
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const csv = [
        'Fecha,Monto,Categoría,Descripción',
        ...data.expenses.map((e) =>
          `${new Date(e.date).toLocaleDateString('es-MX')},${e.amount},${e.category},${e.description || ''}`
        ),
      ].join('\n');

      await Share.share({
        message: csv,
        title: 'Exportar gastos',
      });
    } catch (e) {
      Alert.alert('Error', 'No se pudieron exportar los datos');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      '⚠️ Borrar todos los datos',
      'Esta acción eliminará TODOS tus gastos y no se puede deshacer. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            Alert.alert('Listo', 'Todos los datos han sido eliminados', [
              { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
            ]);
          },
        },
      ]
    );
  };

  const formatCurrency = (val) =>
    val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

  const stats = {
    total: expenses.reduce((s, e) => s + e.amount, 0),
    count: expenses.length,
    oldest: expenses.length > 0
      ? new Date(Math.min(...expenses.map((e) => new Date(e.date)))).toLocaleDateString('es-MX')
      : '-',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configuración</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Stats summary */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Resumen general</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.count}</Text>
              <Text style={styles.statLabel}>Total gastos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatCurrency(stats.total)}</Text>
              <Text style={styles.statLabel}>Acumulado</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.oldest}</Text>
              <Text style={styles.statLabel}>Primer gasto</Text>
            </View>
          </View>
        </View>

        {/* Budget settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Presupuesto</Text>
          <View style={styles.card}>
            <View style={styles.budgetRow}>
              <View>
                <Text style={styles.budgetLabel}>Presupuesto mensual</Text>
                {!editingBudget && (
                  <Text style={styles.budgetValue}>{formatCurrency(budget.monthly)}</Text>
                )}
              </View>
              {!editingBudget && (
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => {
                    setBudgetInput(budget.monthly.toString());
                    setEditingBudget(true);
                  }}
                >
                  <Ionicons name="pencil" size={14} color={Colors.primary} />
                  <Text style={styles.editBtnText}>Editar</Text>
                </TouchableOpacity>
              )}
            </View>

            {editingBudget && (
              <View style={styles.budgetEdit}>
                <View style={styles.budgetInputRow}>
                  <Text style={styles.currencySign}>$</Text>
                  <TextInput
                    style={styles.budgetInput}
                    value={budgetInput}
                    onChangeText={(v) => setBudgetInput(v.replace(/[^0-9.]/g, ''))}
                    keyboardType="decimal-pad"
                    autoFocus
                    selectTextOnFocus
                  />
                </View>
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setEditingBudget(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBudget}>
                    <Text style={styles.saveBtnText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Data management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={handleExport}>
              <View style={styles.settingIcon}>
                <Ionicons name="share-outline" size={18} color={Colors.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Exportar datos</Text>
                <Text style={styles.settingDesc}>Exporta tus gastos en formato CSV</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={handleClearData}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.danger + '20' }]}>
                <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: Colors.danger }]}>Borrar todos los datos</Text>
                <Text style={styles.settingDesc}>Esta acción no se puede deshacer</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Ionicons name="wallet" size={32} color={Colors.primary} />
              <View style={styles.aboutInfo}>
                <Text style={styles.appName}>ExpenseTracker</Text>
                <Text style={styles.appVersion}>Versión 1.0.0 · React Native + Expo</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },

  statsCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsTitle: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textSecondary },
  statDivider: { width: 1, backgroundColor: Colors.border },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },

  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  budgetLabel: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  budgetValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary + '18', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  editBtnText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  budgetEdit: { padding: 16, paddingTop: 0, gap: 12 },
  budgetInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: Colors.borderLight },
  currencySign: { fontSize: 20, color: Colors.textSecondary, marginRight: 4 },
  budgetInput: { flex: 1, fontSize: 24, fontWeight: '700', color: Colors.textPrimary, paddingVertical: 12 },
  editActions: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: Colors.border, alignItems: 'center' },
  cancelBtnText: { fontWeight: '600', color: Colors.textSecondary },
  saveBtn: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center' },
  saveBtnText: { fontWeight: '700', color: '#fff' },

  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.accent + '20', alignItems: 'center', justifyContent: 'center' },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  settingDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 14 },

  aboutRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  aboutInfo: { gap: 2 },
  appName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  appVersion: { fontSize: 12, color: Colors.textSecondary },
});

export default SettingsScreen;
