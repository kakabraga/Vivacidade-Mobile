import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useAuth } from "../context/auth";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
// Utilitário para formatar hora
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function Profile() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const handleLogout = () => {
    logout();
  };
  const handlePostPress = (id) => {
    // Navega para a tela de detalhes, passando o id do post
    navigation.navigate("PostDetails", { postId: id });
    {
      console.log("id do posts: " + id);
    }
  };
  const handleEditPress = (postData) => {
    navigation.navigate("EditPost", { postData });
    console.log("Editando post:", postData.id);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `http://192.168.0.249:3000/api/posts/delete/${postId}`
      );
      // Após deletar, atualiza a lista
      fetchPosts();
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
  };
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.249:3000/api/posts/getpostsporuser/${user.id}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredPosts = posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.create_at) - new Date(a.create_at));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderUserHeader = () => (
    <View style={styles.userHeader}>
      <Image
        source={{
          uri:
            user?.photo ||
            "https://imgur.com/gallery/default-profile-picture-H7Olo4D",
        }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user?.nome || "Usuário"}</Text>
        <Text style={styles.email}>{user?.email || "email@exemplo.com"}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => handlePostPress(item.id)}>
        <Image
          source={{ uri: `http://192.168.0.249:3000/${item.image}` }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <Text style={styles.time}>
          Postado às: {formatTime(item.create_at)}
        </Text>
      </TouchableOpacity>

      {/* Ícone de deletar visível somente para o criador */}
      {item.userId === user.id && (
        <TouchableOpacity
          onPress={() => handleDeletePost(item.id)}
          style={styles.deleteButton}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      )}
      {item.userId === user.id && (
        <TouchableOpacity
          onPress={() => handleEditPress(item.id)}
          style={styles.editButton}>
          <Ionicons name="pencil" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.wrapper} edges={["top", "left", "right"]}>
      <View style={styles.wrapper}>
        {/* Cabeçalho do usuário */}
        {renderUserHeader()}

        {/* Campo de busca */}
        <View style={styles.searchContainer}>
          <Text style={styles.titleSearch}>Buscar posts:</Text>
          <TextInput
            style={styles.searchInput} // Corrigido: estava usando styles.searchContainer em vez de searchInput
            placeholder="Buscar posts..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {/* Ícone de limpar busca */}
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}>
              {/* Certifique-se de importar Ionicons: import { Ionicons } from '@expo/vector-icons' */}
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        {/* Lista de posts */}

        <FlatList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.postsContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#ff9f6e"]}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f8d3cf",
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff0e0",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  titleSearch: {
    backgroundColor: "#fe9588",
    padding: 10,
    borderRadius: 12,
    width: 120,
    color: "white",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 20,
    borderWidth: 3,
    borderColor: "#fe9588",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#cd5c5c",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
  postsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    color: "#cd5c5c",
  },
  content: {
    fontSize: 14,
    marginTop: 5,
    color: "#444",
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: "#e35040",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
    alignSelf: "flex-end",
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff0e0",
    borderRadius: 12,
    margin: 10,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 10,
    paddingHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
deleteButton: {
  position: "absolute",
  top: 8, // Posição superior
  right: 8,
  backgroundColor: "rgba(255,255,255,0.8)",
  borderRadius: 20,
  padding: 4,
  zIndex: 1,
},
editButton: {
  position: "absolute",
  top: 44, // Aumentado para que fique abaixo do botão de deletar
  right: 8,
  backgroundColor: "rgba(255,255,255,0.8)",
  borderRadius: 20,
  padding: 4,
  zIndex: 1,
},

});
