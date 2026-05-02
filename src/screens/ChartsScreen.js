import React from 'react';
import { View, Text, StyleSheet } from "react-native";

export default function ChartsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Análisis</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12141E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  }
});