import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/auth';  // Importando o contexto de autenticação
import api from '../global/services/api';  // Sua instância de API

export default function Post({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  // const [imagem, setImagem] = useState(null);
  const { user } = useAuth();  // Acessando o usuário autenticado do contexto de autenticação
  const userId = user ? user.id : "500";
  // console.log(titulo, conteudo, userId);
  // console.log('Usuário logado:', user);

  // Função para escolher a imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  // Função para enviar o post
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!titulo || !conteudo) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }
  
    const post = {
      title: titulo,
      content: conteudo,
      userId: userId,  // Garantindo que o user esteja presente
    };
  
    try {
      setIsLoading(true);  // Começa o carregamento
  
      const response = await api.post('/api/posts/create', post, {
        headers: {
          'Content-Type': 'application/json', // Altere para 'application/json'
        },
      });
  
      setIsLoading(false);  // Finaliza o carregamento
  
      Alert.alert('Post criado com sucesso!');
      setTitulo('');
      setConteudo('');
    } catch (error) {
      setIsLoading(false);  // Finaliza o carregamento
      console.log(titulo, conteudo, userId);
      console.error('Erro ao enviar post:', error);
      Alert.alert('Erro', 'Erro ao criar post: ' + (error.response?.data?.error || 'Erro desconhecido'));
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.box}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Digite o conteúdo"
        multiline
        value={conteudo}
        onChangeText={setConteudo}
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Selecionar Imagem (opcional)</Text>
      </TouchableOpacity>

      {/* {imagem && (
        <Image source={{ uri: imagem }} style={styles.imagePreview} />
      )} */}

      <Button title="Publicar" style={[styles.button]} onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 2,
    backgroundColor: '#f8d3cf',
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center',     // Centraliza horizontalmente
  },
  box: {
    width: '100%',
    borderColor: '#fe9588',
    backgroundColor: '#fe9588',
    padding: 20,
    borderRadius: 10,
    // Shadow para Android
    elevation: 5,
    // Shadow para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontWeight: 'bold',
    color: '#cd5c5c',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 0.2,
    borderColor: '#cd5c5c',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Distância da sombra
    shadowOpacity: 0.2, // Opacidade da sombra
    shadowRadius: 5, // Raio da sombra
    borderRadius: 8,
    
  },
  imageButton: {
    backgroundColor: '#e35040',
    borderRadius: 8,
    padding: 10,
    marginVertical: 15,
    alignItems: 'center',
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Distância da sombra
    shadowOpacity: 0.2, // Opacidade da sombra
    shadowRadius: 4, // Raio da sombra
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
    
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    borderRadius: 8,
    width: '50%',
  }
});
