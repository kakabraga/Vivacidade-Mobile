import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text,   RefreshControl, } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function EditPost() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    id,
    title: initialTitle,
    content: initialContent,
  } = route.params.postData;

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://192.168.0.249:3000/api/posts/update/${id}`, {
        title,
        content,
      });
      Alert.alert("Sucesso", "Post atualizado!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      Alert.alert("Erro", "Não foi possível atualizar o post.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={content}
        onChangeText={setContent}
        multiline
      />

      <Button title="Salvar alterações" onPress={handleUpdate} />
      <View style={styles.voltar}>
      <Button
        title="Voltar para Home"
        onPress={() => navigation.navigate("HomeTabs")}
        color="#007AFF"
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff0e0",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#cd5c5c",
  },
  voltar: {
    padding: 10,
  },
});
