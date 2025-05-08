import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import axios from 'axios';
import { useAuth } from "../context/auth";
import { SafeAreaView } from 'react-native-safe-area-context';

const CommentsSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://192.168.0.249:3000/api/posts/getComments/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`http://192.168.0.249:3000/api/posts/addcomments/${postId}`, {
        content: newComment,
        id_user: user.id, 
        id_post: postId
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <View style={styles.container}>
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
      {/* Área rolável dos comentários */}
      <ScrollView 
        style={styles.commentsList}
        contentContainerStyle={styles.commentsContent}
      >
        {comments.map((item) => (
          <View key={item.id.toString()} style={styles.commentContainer}>
            {/* Cabeçalho do comentário com foto do usuário */}
            <View style={styles.commentHeader}>
              <Image 
                source={item.user?.photo ? { uri: item.user.photo } : require('../../backend/src/uploads/image.png')} 
                style={styles.userAvatar}
              />
              <Text style={styles.userName}>{item.user?.name || 'Usuário Anônimo'}</Text>
            </View>
            
            {/* Corpo do comentário */}
            <View style={styles.commentBubble}>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
            
            {/* Data do comentário */}
            <Text style={styles.commentDate}>
              {new Date(item.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Área fixa de input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainerWrapper}
      >
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#e1e1e1',
  },
  userName: {
    fontWeight: '600',
    color: '#333',
    fontSize: 14,
  },
  commentBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  inputContainerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 20,
    borderColor: '#e1e1e1',
    borderWidth: 1,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#e60023',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CommentsSection;