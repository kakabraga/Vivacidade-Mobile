// app/login/Login.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useAuth } from '../context/auth';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth(); // ← pega a função login do contexto

  const handleLogin = async () => {
    if (!email || !senha) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }
  
    try {
      const response = await fetch('http://192.168.0.249:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });
  
      if (!response.ok) {
        throw new Error('Falha no login');
      }
  
      const data = await response.json();  // Resposta da API convertida em JSON
      const { token } = data;  // Supondo que a resposta tenha o campo token
  
      // Chama a função login do AuthContext para guardar token
      await login(token);  // Passa apenas o token
  
      console.log('Resposta do servidor:', data);  // Mostra a resposta com token
  
      // Navega para a tela principal
      // navigation.navigate('HomeTabs');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Credenciais inválidas ou servidor fora do ar');
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        style={styles.input}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Button title="Entrar" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  input: {
    height: 40,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  link: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 20,
  },
});