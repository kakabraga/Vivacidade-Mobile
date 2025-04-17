import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import api from '../global/services/api';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = async () => {
    try {
      await api.post('/api/users/create', {
        nome,
        email,
        senha,
      });

      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar. Verifique os dados.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
      />

      <Button title="Registrar" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tem uma conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, marginBottom: 24, textAlign: 'center' },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  link: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 20,
  },
});
