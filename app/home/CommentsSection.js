import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  // FlatList, // FlatList está importado, mas o componente usa ScrollView para exibir os comentários. Mantenho comentado para evitar confusão se não for utilizado.
  StyleSheet,
  ScrollView, // Onde os comentários são realmente mapeados e exibidos
  RefreshControl,
  KeyboardAvoidingView,
  Platform, // Importado para detectar o SO
  Image,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/auth";
import { useNavigation } from "@react-navigation/native"; 

const CommentsSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  // const [loading, setLoading] = useState(true); // 'loading' não está sendo usado, mantido comentado

  const navigation = useNavigation(); 

  // Define a baseURL corretamente para cada plataforma.
  // Para Android, usa o IP da sua máquina na rede local.
  // Para Web (no mesmo computador), usa 'localhost'.
  const baseURL = Platform.OS === 'android'
    ? 'http://192.168.0.249:3000'
    : Platform.OS === 'web'
    ? 'http://localhost:3000'
    : '';

  // Define uma imagem de placeholder para perfis de usuário


  // Função auxiliar para corrigir o caminho da imagem
  const getCorrectedPath = (originalPath) => {
    if (!originalPath) return null;
    let correctedPath = originalPath;
    if (originalPath.startsWith('uploads') && !originalPath.startsWith('uploads/')) {
      correctedPath = originalPath.replace('uploads', 'uploads/');
    } else if (!originalPath.startsWith('uploads/') && !originalPath.startsWith('http')) {
      // Se não começar com 'uploads/' E não for uma URL externa, assume que é um arquivo local
      correctedPath = `uploads/${originalPath}`;
    }
    return correctedPath;
  };

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
        `${baseURL}/api/posts/getComments/${postId}` // Usando baseURL
      );
      // Garante que os comentários mais recentes apareçam primeiro
      const sortedComments = response.data.sort((a, b) => new Date(b.comment_at) - new Date(a.comment_at));
      setComments(sortedComments);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error.message || error);
    } finally {
      // setLoading(false); // 'loading' não está sendo usado aqui
    }
  };

  // Adiciona novo comentário
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Impede envio de comentário vazio
    try {
      await axios.post(
        `${baseURL}/api/posts/addcomments/${postId}`, // Usando baseURL
        {
          content: newComment,
          id_user: user.id,
          id_post: postId,
        }
      );
      setNewComment("");
      fetchComments(); // Atualiza lista após adicionar
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error.message || error);
    }
  };

  // Função para atualizar comentários ao puxar para baixo
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchComments().finally(() => setRefreshing(false)); 
  }, [baseURL, postId]); // Adicionado baseURL e postId como dependências

  useEffect(() => {
    fetchComments();
  }, [postId, baseURL]); // Adicionado baseURL como dependência

  // Navega até o perfil do usuário
  const handleProfilePress = (id) => {
    navigation.navigate('Profie_user', { userId: id }); // Corrigido o nome da rota se for 'Profile_user'
    console.log(`Navegando para o perfil do usuário: ${id}`);
  };

  return (
    <View style={styles.container}>
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
        {comments.length > 0 ? (
          comments.map((item) => {
            // Determina a URL final da imagem de perfil do comentador
            let finalUserPhotoSource;
            if (item.user?.photo) {
              let photoPath = item.user.photo;
              if (!photoPath.startsWith('http')) {
                photoPath = `${baseURL}/${getCorrectedPath(photoPath)}`;
              }
              finalUserPhotoSource = { uri: photoPath };
            }

            console.log('Final Image Source for user avatar:', finalUserPhotoSource); // Log de depuração

            return (
              <View key={item.id.toString()} style={styles.commentContainer}>
                {/* Cabeçalho com foto e nome */}
                <View style={styles.commentHeader}>
                  <Image
                    source={finalUserPhotoSource} // Usando a source final
                    style={styles.userAvatar}
                    // defaultSource não é necessário aqui, pois a 'source' já está garantida
                  />
                  <TouchableOpacity onPress={() => handleProfilePress(item.id_user)}> {/* Corrigido para item.id_user */}
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
            );
          })
        ) : (
          <Text style={styles.noCommentsText}>Nenhum comentário ainda. Seja o primeiro a comentar!</Text>
        )}
      </ScrollView>

      {/* Área de input e botão de publicar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainerWrapper}
      >
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Adicione um comentário..."
            placeholderTextColor="#999"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={250} // Limita o tamanho do comentário
          />
          <TouchableOpacity
            style={[styles.button, !newComment.trim() && styles.buttonDisabled]}
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Text style={styles.buttonText}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0e0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    backgroundColor: "#e1e1e1", // Cor de fundo para o placeholder visual
    borderWidth: 1, // Adiciona borda sutil
    borderColor: '#ddd',
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
    fontSize: 14, // Ajustado para ser mais compacto
    color: "#333",
    lineHeight: 18, // Altura da linha para melhor leitura
  },
  commentDate: {
    fontSize: 11, // Ajustado
    color: "#999",
    textAlign: "right",
  },
  inputContainerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff0e0",
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
    backgroundColor: "#ff9f6e", // Cor ajustada para o tema
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000", // Adiciona sombra
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0, // Remove sombra quando desabilitado
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  noCommentsText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    color: '#888',
  },
});

export default CommentsSection;
