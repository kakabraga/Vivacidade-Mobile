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
  TouchableOpacity,
  Platform,
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Define the baseURL correctly for each platform.
  // For Android, use your machine's local IP on the network.
  // For Web (on the same computer), use 'localhost'.
  const baseURL = Platform.OS === 'android'
    ? 'http://192.168.0.249:3000'
    : Platform.OS === 'web'
    ? 'http://localhost:3000' // Changed to localhost for web/desktop environment
    : '';

  const navigation = useNavigation();

  const fetchPostsLastPosts = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/posts/getLastPosts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching last posts (fetchPostsLastPosts):', error.message || error);
      // Optional: Add visual feedback for the user in case of an error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/posts/get`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts (fetchPosts):', error.message || error);
      // Optional: Add visual feedback for the user in case of an error
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handlePostPress = (id) => {
    navigation.navigate('PostDetails', { postId: id });
  };

  const renderItem = ({ item }) => {
    // Log the original image path from the backend
    console.log('Original item.image:', item.image);

    // Correct the image path if it's missing the slash after 'uploads'
    let correctedImagePath = item.image;
    if (item.image && item.image.startsWith('uploads') && !item.image.startsWith('uploads/')) {
      // If it starts with 'uploads' but not 'uploads/', insert the slash
      correctedImagePath = item.image.replace('uploads', 'uploads/');
    } else if (item.image && !item.image.startsWith('uploads/')) {
      // If it doesn't start with 'uploads/', assume it's just the filename and prepend 'uploads/'
      correctedImagePath = `uploads/${item.image}`;
    }

    // Log the corrected image path
    console.log('Corrected Image Path:', correctedImagePath);

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => handlePostPress(item.id)}>
          {/* Render the image with the full URL */}
          <Image
            source={{ uri: `${baseURL}/${correctedImagePath}` }}
            style={styles.image}
            resizeMode="cover"
            // Add a local placeholder that you should create in ./assets/placeholder.png
            // Add more detailed error handling
           
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.time}>Postado ás: {formatTime(item.create_at)}</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
          placeholder="Search by title..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {!!searchTerm && (
          <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
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
    paddingBottom: 70,
  },
  card: {
    flex: 1,
    margin: 3,
    backgroundColor: '#fff0e0',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 25,
  },
  content: {
    fontSize: 20,
    marginTop: 4,
  },
  time: {
    fontSize: 18,
    color: '#555',
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
