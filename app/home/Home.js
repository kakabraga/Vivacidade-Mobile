
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Home () {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Você está logado! 🎉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d3cf',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
});
