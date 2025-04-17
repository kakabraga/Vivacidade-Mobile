// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Home from '../home/Home';
// import { View, Text } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// const Tab = createBottomTabNavigator();

// function Perfil() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Perfil</Text>
//     </View>
//   );
// }

// function Post() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Post</Text>
//     </View>
//   );
// }

// export default function Navibar() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Home') {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === 'Perfil') {
//             iconName = focused ? 'person' : 'person-outline';
//           } else if (route.name === 'Post') {
//             iconName = focused ? 'add-circle' : 'add-circle-outline';
//           }

//           return <Icon name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: '#6C63FF',
//         tabBarInactiveTintColor: 'gray',
//         tabBarStyle: {
//           height: 65,
//           paddingBottom: 10,
//           paddingTop: 10,
//           backgroundColor: '#fff',
//           borderTopLeftRadius: 20,
//           borderTopRightRadius: 20,
//           position: 'absolute',
//         },
//         headerShown: false,
//         tabBarLabelStyle: {
//           fontSize: 12,
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={Home} />
//       <Tab.Screen name="Post" component={Post} />
//       <Tab.Screen name="Perfil" component={Perfil} />
//     </Tab.Navigator>
//   );
// }
