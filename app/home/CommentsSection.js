import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/auth";
import profile from "../profile/Profile"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native"; 

const CommentsSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation(); 

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const retorno_hora = `${hours}:${minutes}`;
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0"); 
    const data = `${dia}/${mes}`;
    return `${data} ${retorno_hora}`;
  };

  // Busca os comentários do post
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.249:3000/api/posts/getComments/${postId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  };

  // Adiciona novo comentário
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Impede envio de comentário vazio
    try {
      await axios.post(
        `http://192.168.0.249:3000/api/posts/addcomments/${postId}`,
        {
          content: newComment,
          id_user: user.id,
          id_post: postId,
        }
      );
      setNewComment("");
      fetchComments(); // Atualiza lista após adicionar
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  // Função para atualizar comentários ao puxar para baixo
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchComments().finally(() => setRefreshing(false)); 
  }, []);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Navega até o perfil do usuário
  const handleProfilePress = (id) => {
    navigation.navigate('Profie_user', { userId: id });
    console.log(id + "navigate")
  };


  const filteredComments = comments.filter((comment) =>
    comment.content.toLowerCase().includes(newComment.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* FlatList estava com renderItem errado, foi trocado por ScrollView abaixo */}
      {/* A FlatList abaixo pode ser removida ou usada para futura implementação de carregamento paginado */}
      
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Adicione um comentário..."
          placeholderTextColor="#999"
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={[styles.button, !newComment.trim() && styles.buttonDisabled]}
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Text style={styles.buttonText}>Publicar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de comentários */}
      <ScrollView
        style={styles.commentsList}
        contentContainerStyle={styles.commentsContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ff9f6e"]}
          />
        }
      >
        {filteredComments.map((item) => (
          <View key={item.id.toString()} style={styles.commentContainer}>
            {/* Cabeçalho com foto e nome */}
            <View style={styles.commentHeader}>
              <Image
                source={
                  item.user?.photo
                    ? { uri: item.user.photo }
                    : require("../../backend/src/uploads/image.png")
                }
                style={styles.userAvatar}
              />
              <TouchableOpacity onPress={() => handleProfilePress(item.userId)}>
                <Text style={styles.userName}>
                  {item.nome || "Usuário Anônimo"}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Texto do comentário */}
            <View style={styles.commentBubble}>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
            {/* Data e hora */}
            <Text style={styles.commentDate}>
              <Text style={styles.time}>{formatTime(item.comment_at)}</Text>
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Espaço reservado para evitar que o teclado cubra o input em iOS */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainerWrapper}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  commentsContent: {
    paddingBottom: 100, // Espaço para o input não cobrir os últimos comentários
  },
  commentContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#e1e1e1",
  },
  userName: {
    fontWeight: "600",
    color: "#333",
    fontSize: 14,
  },
  commentBubble: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  inputContainerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 20,
    borderColor: "#e1e1e1",
    borderWidth: 1,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#e60023",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default CommentsSection;
