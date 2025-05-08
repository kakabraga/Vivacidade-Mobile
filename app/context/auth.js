// app/context/auth.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../global/services/api';
import { jwtDecode } from 'jwt-decode';


// Cria o contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const decodedUser = jwtDecode(token);

          setUser(decodedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do storage:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const decodedUser = jwtDecode(token);

      setUser(decodedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro no login:', error);
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) return null; // Pode colocar um spinner de loading futuramente

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
 