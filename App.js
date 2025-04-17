import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './app/context/auth'; // Importando o AuthProvider
import Login from './app/login/Login';
import Register from './app/login/Register';
import Home from './app/home/Home';
import Profile from './app/profile/Perfil';
import Post from './app/forms/Post';

// Definindo as navegações
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tela placeholder para exemplo
function Perfil() {
  return <Profile />; // Usando o componente Profile aqui
}

function PostForm() {
  return <Post />; // Usando o componente PostContent aqui
}

function HomeTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Post') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#dbe16e',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#ff9f6e',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Perfil" component={Perfil} />
      <Tab.Screen name="Post" component={PostForm} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider> {/* Envolvendo a navegação com AuthProvider */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="HomeTabs" component={HomeTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
