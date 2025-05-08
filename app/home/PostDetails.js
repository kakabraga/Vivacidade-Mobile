import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import CommentsSection from "./CommentsSection";
import axios from "axios";

const PostDetails = ({ route }) => {
  const { postId } = route.params; // Recebe o id do post
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPostDetails = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.249:3000/api/posts/getid/${postId}`
      );
      setPost(response.data); // ✅ ajustado para novo formato da API
    } catch (error) {
      console.error("Erro ao buscar detalhes do post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8d3cf' }}>
    <View style={styles.container}>
      {post ? (
        
        <View style={styles.card}>
          <Image
            source={{ uri: `http://192.168.0.249:3000/${post.image}` }}
            style={styles.image}
          />
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.content}>{post.content}</Text>
          <Text style={styles.time}>Postado às: {post.create_at}</Text>
        </View>
      ) : (
        <Text>Post não encontrado</Text>
      )}
      {post && <CommentsSection postId={post.id} />}
    </View>
      </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },
  time: {
    fontSize: 13,
    color: '#999',
    textAlign: 'right',
  },
});

export default PostDetails;
