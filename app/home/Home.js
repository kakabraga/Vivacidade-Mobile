import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPostsLastPosts = async () => {
    try {
      const response = await axios.get('http://192.168.0.249:3000/api/posts/getLastPosts');
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://192.168.0.249:3000/api/posts/get');
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPostsLastPosts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPostsLastPosts();
  }, []);

  // Função para formatar a data e extrair o horário
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
    return `${hours}:${minutes}`; // Retorna o horário no formato HH:MM
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `http://192.168.0.249:3000/${item.image}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.time}>Postado às: {formatTime(item.create_at)}</Text> {/* Exibe o horário formatado */}
    </View>
  );

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color="#ff9f6e" style={{ marginTop: 50 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8d3cf' }}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ff9f6e']} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 70
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff0e0',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'column', // Organiza os elementos em coluna
    justifyContent: 'space-between', // Espaça os elementos para que o horário fique na parte inferior
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 14,
  },
  content: {
    fontSize: 12,
    marginTop: 4,
  },
  timeContainer: {
    flexDirection: 'row', // Alinha o ícone e o texto do horário
    alignItems: 'center', // Centraliza verticalmente
    marginTop: 8, // Espaçamento superior
  },
  time: {
    fontSize: 12,
    color: '#555', // Cor mais suave
    marginLeft: 4, // Espaçamento entre o ícone e o texto
    fontWeight: '300', // Peso de fonte mais leve
  },
  timeIcon: {
    marginRight: 4, // Espaçamento entre o ícone e o texto
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
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
  clearButton: {
    paddingLeft: 8,
  },
});

