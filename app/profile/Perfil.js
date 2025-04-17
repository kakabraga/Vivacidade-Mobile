// Perfil.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Perfil = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{ uri: 'https://www.example.com/your-avatar.jpg' }} // Substitua pela URL ou caminho da imagem
      />
      <Text style={styles.name}>Nome do Usuário</Text>
      <Text style={styles.email}>email@exemplo.com</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Idade: 60 anos</Text>
        <Text style={styles.infoText}>Localização: São Paulo, SP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
});

export default Perfil;
