import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CommentsSection from "./CommentsSection";
import { Video } from "expo-av";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // ícone para o botão

const PostDetails = ({ route }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Hook para navegação

  const fetchPostDetails = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.249:3000/api/posts/getid/${postId}`
      );
      setPost(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#ff9f6e"
        style={{ marginTop: 50 }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        <View style={styles.container}>
          {/* Botão de Voltar */}
          <TouchableOpacity
            onPress={() => navigation.navigate("HomeTabs")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          {post ? (
            <View style={styles.card}>
              {post.image && (
                <Image
                  source={{ uri: `http://192.168.0.249:3000/${post.image}` }}
                  style={styles.image}
                />
              )}
              {post.video && (
                <Video
                  source={{ uri: `http://192.168.0.249:3000/${post.video}` }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                />
              )}
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.content}>{post.content}</Text>
              <Text style={styles.time}>
                Postado às: {formatTime(post.create_at)}
              </Text>
            </View>
          ) : (
            <Text>Post não encontrado</Text>
          )}
          {post && <CommentsSection postId={post.id} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    marginBottom: 12,
  },
  time: {
    fontSize: 13,
    color: "#999",
    textAlign: "right",
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
});

export default PostDetails;
