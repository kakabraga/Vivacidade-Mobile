import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../context/auth'; 
export default function Profile_user({ route }) {
  const { userId } = route.params;
  console.log(userId + " foi")
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Hook para navegação

  const fetchProfileDetails = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.249:3000/api/users/getuserbyid/${userId}`,
      );
      setUser(response.data[0]);
      console.log(response.data)
    } catch (error) {
      console.error("Erro ao buscar detalhes do perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, [userId]);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!user) {
    return <Text>Usuário não encontrado.</Text>;
  }

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: user?.photo || 'https://imgur.com/gallery/default-profile-picture-H7Olo4D' }} 
        style={styles.avatar} 
      />
      <Text style={styles.name}>{user.nome || 'Usuário'}</Text>
      <Text style={styles.email}>{user?.email || 'email@exemplo.com'}</Text>
      <Button
        title="Voltar para Home"
        onPress={() => navigation.navigate("HomeTabs")}
        color="#007AFF"
      />
    </View> 
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8d3cf", // Cor de fundo suave
    alignItems: "center",
    justifyContent: "flex-start", // Alinhamento para o topo
    padding: 20,
    paddingBottom: 70,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3, // Aumenta a largura da borda
    borderColor: "#fe9588", // Cor da borda
    shadowColor: "#000", // Sombra para profundidade
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Sombra para Android
  },
  name: {
    fontSize: 26, // Aumenta o tamanho da fonte
    fontWeight: "700", // Peso da fonte mais forte
    color: "#cd5c5c", // Cor do texto
    marginBottom: 8,
  },
  email: {
    fontSize: 18, // Aumenta o tamanho da fonte
    color: "#555", // Cor do texto mais escura
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: "#e35040", // Cor de fundo do botão
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10, // Bordas mais arredondadas
    marginTop: 20, // Espaçamento superior
    shadowColor: "#000", // Sombra para profundidade
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  logoutButtonText: {
    color: "#fff", // Cor do texto do botão
    fontSize: 18, // Aumenta o tamanho da fonte
    fontWeight: "bold", // Peso da fonte
    textAlign: "center", // Centraliza o texto
  },
});
