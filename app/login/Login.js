import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/auth";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth(); // ← pega a função login do contexto

  const handleLogin = async () => {
    if (!email || !senha) {
      return Alert.alert("Erro", "Preencha todos os campos");
    }

    try {
      const response = await fetch(
        "http://192.168.0.249:3000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        }
      );

      if (!response.ok) {
        throw new Error("Falha no login");
      }

      const data = await response.json(); // Resposta da API convertida em JSON
      const { token } = data; // Supondo que a resposta tenha o campo token

      // Chama a função login do AuthContext para guardar token
      await login(token); // Passa apenas o token

      console.log("Resposta do servidor:", data); // Mostra a resposta com token

      // Navega para a tela principal
      // navigation.navigate('HomeTabs');
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Credenciais inválidas ou servidor fora do ar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff8f2", // tom suave de fundo
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333", // cor do seu tema
    textAlign: "center", // centraliza o texto dentro do próprio Text
    marginBottom: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#e76f51",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: "#e76f51",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#e76f51",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#264653",
    textAlign: "center",
    marginTop: 24,
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
