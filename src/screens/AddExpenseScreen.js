import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { DEFAULT_CATEGORIES } from '../constants/categories';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const AddExpenseScreen = ({ navigation, onAdd, customCategories = [] }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

  const handleAmountChange = (val) => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length <= 2) setAmount(cleaned);
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido mayor a 0');
      return;
    }
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Error', 'Formato de fecha inválido (YYYY-MM-DD)');
      return;
    }

    setLoading(true);
    try {
      const expense = {
        id: generateId(),
        amount: parseFloat(amount),
        category: selectedCategory,
        description: description.trim(),
        date: new Date(date).toISOString(),
        createdAt: new Date().toISOString(),
      };
      await onAdd(expense);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el gasto');
    } finally {
      setLoading(false);
    }
  };

  const formatDateDisplay = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'long' });
  };

  const adjustDate = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Nuevo gasto</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Amount input */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>¿Cuánto gastaste?</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>
            <Text style={styles.amountHint}>MXN</Text>
          </View>

          {/* Date selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Fecha</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity style={styles.dateArrow} onPress={() => adjustDate(-1)}>
                <Ionicons name="chevron-back" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateDisplay}>
                <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
                <Text style={styles.dateText}>{formatDateDisplay(date)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateArrow}
                onPress={() => adjustDate(1)}
                disabled={date >= new Date().toISOString().split('T')[0]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={date >= new Date().toISOString().split('T')[0] ? Colors.textMuted : Colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Category selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Categoría</Text>
            <View style={styles.categoriesGrid}>
              {allCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === cat.id && {
                      backgroundColor: cat.color + '22',
                      borderColor: cat.color,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.catIconWrap, { backgroundColor: cat.bgColor }]}>
                    <Ionicons name={cat.icon} size={20} color={cat.color} />
                  </View>
                  <Text
                    style={[
                      styles.catName,
                      selectedCategory === cat.id && { color: cat.color, fontWeight: '700' },
                    ]}
                    numberOfLines={1}
                  >
                    {cat.name}
                  </Text>
                  {selectedCategory === cat.id && (
                    <View style={[styles.checkMark, { backgroundColor: cat.color }]}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Descripción (opcional)</Text>
            <TextInput
              style={styles.descInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Ej: Uber al trabajo, almuerzo en el mercado..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={2}
              maxLength={120}
            />
            <Text style={styles.charCount}>{description.length}/120</Text>
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <Text style={styles.submitText}>Guardando...</Text>
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.submitText}>Guardar gasto</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },

  amountCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  amountLabel: { fontSize: 14, color: Colors.textSecondary, marginBottom: 16 },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  currencySymbol: { fontSize: 32, fontWeight: '700', color: Colors.textSecondary },
  amountInput: {
    fontSize: 52,
    fontWeight: '800',
    color: Colors.textPrimary,
    minWidth: 120,
    textAlign: 'center',
  },
  amountHint: { fontSize: 13, color: Colors.textMuted, marginTop: 8 },

  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dateArrow: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dateText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryItem: {
    width: '30%',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  catIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', fontWeight: '500' },
  checkMark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  descInput: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    color: Colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  charCount: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', marginTop: 4 },

  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

export default AddExpenseScreen;
