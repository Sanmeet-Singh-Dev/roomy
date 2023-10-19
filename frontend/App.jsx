import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginOptions from './screens/LoginOptions';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Details from './screens/Details';
import ChatsScreen from './screens/ChatsScreen';
import NewChatScreen from './screens/NewChatScreen'
import ChatMessagesScreen from './screens/ChatMessagesScreen';
import { UserContext } from './UserContext';


const stack = createNativeStackNavigator();

export default function App() {
  return (

    <UserContext>
      <NavigationContainer>

      <stack.Navigator initialRouteName='loginOptions'>
        <stack.Screen name="loginOptions" component={LoginOptions} options={{headerShown: false}} />
        <stack.Screen name='login' component={Login} options={{ headerShown: false }} />
        <stack.Screen name='register' component={Register} options={{ headerShown: false }} />
        <stack.Screen name='home' component={Home} options={{ headerShown: false }} />
        <stack.Screen name='details' component={Details} options={{ headerShown: false }} />
        <stack.Screen name="Chats" component={ChatsScreen}/>
        <stack.Screen name="newChat" component={NewChatScreen} />
        <stack.Screen name="Messages" component={ChatMessagesScreen} />
      </stack.Navigator>

      </NavigationContainer>
      </UserContext>
  );
}