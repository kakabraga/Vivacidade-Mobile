const React = require('react');
const { createContext, useContext, useEffect, useState } = React;
import api from '../global/services/api';
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Adicione esta linha no começo do arquivo

// Cria o contexto de autenticação
export const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Define o header Authorization para futuras requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Decodifica o token para obter os dados do usuário (certifique-se que o token contém o campo "id")
        try {
          console.log('Token recebido:', token);
          const decodedUser = jwtDecode(token);
          console.log('Usuário decodificado:', decodedUser);
          
          setUser(decodedUser);  // Salva o usuário no contexto
          setIsAuthenticated(true);  // Marca como autenticado
          
          // Opcional: Também podemos armazenar o usuário no AsyncStorage para facilitar o acesso após reinicialização
          await AsyncStorage.setItem('user', JSON.stringify(decodedUser));
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
          setIsAuthenticated(false);
        }
      } else {
        // Se não houver token, marca como não autenticado
        setIsAuthenticated(false);
      }
      setLoading(false);  // Finaliza o carregamento
    };
  
    loadToken();  // Chama a função para carregar o token e o usuário
  
  }, []);
  const login = async (token) => {
    await AsyncStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const decodedUser = jwt_decode(token);
      await AsyncStorage.setItem('user', JSON.stringify(decodedUser)); // 👈 adiciona isso
      setUser(decodedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      setIsAuthenticated(false);
    }
  };
  

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) return null; // Pode retornar um indicador de loading

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};