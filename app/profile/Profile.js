import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList, // Importado para exibir a lista de posts
  StyleSheet,
  ActivityIndicator, // Importado para o indicador de carregamento
  RefreshControl, // Importado para a funcionalidade de "pull to refresh"
  TouchableOpacity, // Importado para os botões e itens clicáveis
  Platform, // Importado para detectar o SO e ajustar a baseURL
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Importado para o ícone de voltar

// Utilitário para formatar a hora (mantido como está)
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function Profile_user({ route }) {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // Novo estado para armazenar os posts do usuário
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento geral
  const [refreshing, setRefreshing] = useState(false); // Estado para controlar o "pull to refresh"
  const navigation = useNavigation();

  // Define a baseURL corretamente para cada plataforma.
  // Para Android, usa o IP da sua máquina na rede local.
  // Para Web (no mesmo computador), usa 'localhost'.
  const baseURL =
    Platform.OS === "android"
      ? "http://192.168.0.249:3000"
      : Platform.OS === "web"
      ? "http://localhost:3000"
      : "";

  // Define uma imagem de placeholder para o perfil do usuário e para os posts
  // const defaultProfilePicture = require('./assets/default-profile.png');

  // Função auxiliar para corrigir o caminho da imagem (reutilizada)
  const getCorrectedPath = (originalPath) => {
    if (!originalPath) return null;
    let correctedPath = originalPath;
    if (
      originalPath.startsWith("uploads") &&
      !originalPath.startsWith("uploads/")
    ) {
      correctedPath = originalPath.replace("uploads", "uploads/");
    } else if (
      !originalPath.startsWith("uploads/") &&
      !originalPath.startsWith("http")
    ) {
      correctedPath = `uploads/${originalPath}`;
    }
    return correctedPath;
  };

  // Função para buscar os detalhes do perfil do usuário
  const fetchProfileDetails = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/users/getuserbyid/${userId}`
      );
      setUser(response.data[0]);
    } catch (error) {
      console.error(
        "Erro ao buscar detalhes do perfil:",
        error.message || error
      );
    }
  };

  // Função para buscar os posts do usuário
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/posts/getpostsporuser/${userId}`
      );
      // Ordena os posts por data de criação, do mais recente para o mais antigo
      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.create_at) - new Date(a.create_at)
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Erro ao buscar posts do usuário:", error.message || error);
    } finally {
      setRefreshing(false); // Termina o refresh, se estiver ativo
    }
  };

  // useEffect para buscar dados quando o componente é montado ou o userId/baseURL muda
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Inicia o carregamento
      await Promise.all([fetchProfileDetails(), fetchUserPosts()]); // Busca ambos paralelamente
      setLoading(false); // Finaliza o carregamento quando ambos terminam
    };
    fetchData();
  }, [userId, baseURL]); // Dependências: userId e baseURL

  // Callback para o "pull to refresh"
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserPosts(); // Apenas busca os posts novamente ao refrescar
  }, [baseURL, userId]);

  // Handler para navegar para os detalhes do post
  const handlePostPress = (id) => {
    navigation.navigate("PostDetails", { postId: id });
  };

  // Renderiza o cabeçalho do perfil do usuário
  const renderUserHeader = () => {
    // Determina a URL final da imagem de perfil
    let photoUri = user?.photo;
    if (photoUri && !photoUri.startsWith("http")) {
      photoUri = `${baseURL}/${getCorrectedPath(photoUri)}`;
    }

    return (
      <View style={styles.userHeader}>
        <Image source={{ uri: photoUri }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.nome || "Usuário"}</Text>
          <Text style={styles.email}>{user?.email || "email@exemplo.com"}</Text>
          {/* O botão "Voltar para Home" foi substituído por um ícone de voltar no topo */}
        </View>
      </View>
    );
  };

  // Renderiza cada item da FlatList (card de post)
  const renderItem = ({ item }) => {
    // Corrige o caminho da imagem do post
    const correctedImagePath = getCorrectedPath(item.image);

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => handlePostPress(item.id)}>
          <Image
            source={{ uri: `${baseURL}/${correctedImagePath}` }}
            style={styles.postImage}
            resizeMode="cover"
          />
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postContent}>{item.content}</Text>
          <Text style={styles.postTime}>
            Postado às: {formatTime(item.create_at)}
          </Text>
        </TouchableOpacity>
        {/* Ícones de editar/deletar não são visíveis para outros usuários aqui */}
      </View>
    );
  };

  // Exibe um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#ff9f6e"
        style={styles.loadingIndicator}
      />
    );
  }

  // Exibe mensagem se o usuário não for encontrado após o carregamento
  if (!user) {
    return <Text style={styles.notFoundText}>Usuário não encontrado.</Text>;
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Botão de Voltar no topo */}
      <TouchableOpacity
        onPress={() => navigation.goBack()} // goBack para voltar à tela anterior
        style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <FlatList
        ListHeaderComponent={renderUserHeader()} // Renderiza o cabeçalho do usuário no topo da lista
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Exibe posts em duas colunas para um visual compacto
        contentContainerStyle={styles.postsListContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#f8d3cf"]}
          />
        }
        // Exibe mensagem se não houver posts
        ListEmptyComponent={
          <Text style={styles.noPostsText}>
            Nenhum post encontrado para este usuário.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f8d3cf",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "#cd5c5c",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8d3cf", // Fundo do botão de voltar
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff0e0",
    borderRadius: 12, // Mantém o arredondamento
    margin: 10,
    marginBottom: 20, // Espaço após o cabeçalho do usuário
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 100, // Tamanho ajustado
    height: 100, // Tamanho ajustado
    borderRadius: 50, // Metade da largura/altura para ser circular
    marginRight: 20,
    borderWidth: 3,
    borderColor: "#fe9588",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 22, // Ajustado para ser proeminente
    fontWeight: "700",
    color: "#cd5c5c",
    marginBottom: 4,
  },
  email: {
    fontSize: 16, // Ajustado
    color: "#555",
  },
  postsListContainer: {
    paddingHorizontal: 8, // Ajustado o padding horizontal da FlatList
    paddingBottom: 70, // Padding inferior para não cortar o conteúdo
  },
  card: {
    flex: 1,
    margin: 3,
    backgroundColor: "#fff0e0",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  postImage: {
    // Renomeado de 'image' para 'postImage' para evitar conflito e clareza
    width: "100%",
    height: 100, // Altura compacta para a imagem do post
    borderRadius: 6,
  },
  postTitle: {
    // Renomeado de 'title' para 'postTitle'
    fontWeight: "bold",
    marginTop: 6,
    fontSize: 25,
    maxHeight: 32, // Limita a 2 linhas
    overflow: "hidden",
  },
  postContent: {
    // Renomeado de 'content' para 'postContent'
    fontSize: 20,
    marginTop: 2,
    maxHeight: 28, // Limita a 2-3 linhas
    overflow: "hidden",
  },
  postTime: {
    // Renomeado de 'time' para 'postTime'
    fontSize: 9,
    color: "#555",
    marginTop: 4,
    textAlign: "right",
  },
  noPostsText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#888",
  },
  // Estilos de botões de logout, delete e edit (mantidos se não forem usados nesta tela)
  // logoutButton: { ... },
  // logoutButtonText: { ... },
  // deleteButton: { ... },
  // editButton: { ... },
});
