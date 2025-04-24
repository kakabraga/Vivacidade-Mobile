import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useAuth } from "../context/auth";
import api from "../global/services/api";
import * as ImagePicker from "expo-image-picker";

export default function Post({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemFile, setImagemFile] = useState(null); // para Web
  const { user } = useAuth();
  const userId = user ? user.id : "500";

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImagem(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!titulo || !conteudo) {
      return Alert.alert("Erro", "Preencha todos os campos");
    }

    try {
      let formData = new FormData();
      formData.append("title", titulo);
      formData.append("content", conteudo);
      formData.append("userId", userId);

      if (Platform.OS === "web" && imagemFile) {
        formData.append("image", imagemFile);
      } else if (imagem && Platform.OS !== "web") {
        formData.append("image", {
          uri: imagem,
          type: "image/jpeg",
          name: `photo_${Date.now()}.jpg`,
        });
      }

      const response = await api.post("/api/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Post criado com sucesso!");
      setTitulo("");
      setConteudo("");
      setImagem(null);
      setImagemFile(null);
    } catch (error) {
      console.error("Erro ao enviar post:", error);
      Alert.alert(
        "Erro",
        "Erro ao criar post: " +
          (error.response?.data?.message || "Erro desconhecido")
      );
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

        {Platform.OS === "web" ? (
          <View style={styles.imageButton}>
            <Text
              style={styles.imageButtonText}
              onPress={() => document.getElementById("fileInput").click()}>
              Selecionar Imagem (opcional)
            </Text>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImagem(URL.createObjectURL(file));
                  setImagemFile(file);
                }
              }}
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>
              Selecionar Imagem (opcional)
            </Text>
          </TouchableOpacity>
        )}

        {imagem && (
          <Image source={{ uri: imagem }} style={styles.imagePreview} />
        )}

        <Button title="Publicar" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 2,
    backgroundColor: "#f8d3cf",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "100%",
    borderColor: "#fe9588",
    backgroundColor: "#fe9588",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontWeight: "bold",
    color: "#cd5c5c",
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 0.2,
    borderColor: "#cd5c5c",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderRadius: 8,
  },
  imageButton: {
    backgroundColor: "#e35040",
    borderRadius: 8,
    padding: 10,
    marginVertical: 15,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imageButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  webInputWrapper: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 15,
    borderRadius: 8,
    borderColor: "#cd5c5c",
    borderWidth: 0.2,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    borderRadius: 8,
    width: "50%",
  },
});
