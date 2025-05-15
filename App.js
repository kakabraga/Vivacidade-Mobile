import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './app/context/auth';
import Login from './app/login/Login';
import Register from './app/login/Register';
import Home from './app/home/Home';
import Profile from './app/profile/Perfil';
import Profile_user from './app/profile/Profile';
import Post from './app/forms/Post';
import PostDetails from './app/home/PostDetails';
import EditPost from './app/home/EditPost';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Definindo as navegações
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tela placeholder
function Perfile_user() {
  return <Profile_user />;
}
function Perfil() {
  return <Profile />;
}
function PostForm() {
  return <Post />;
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

function AppRoutes() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // Usuário logado: mostrar as abas do app
            <Stack.Screen name="HomeTabs" component={HomeTabNavigator} />
          ) : (
            // Usuário não logado: mostrar o login
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
            </>
          )}
          {/* Tela de detalhes do post */}
          <Stack.Screen name="PostDetails" component={PostDetails} />
          <Stack.Screen name="Profie_user" component={Profile_user} />
          <Stack.Screen name="EditPost" component={EditPost} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
