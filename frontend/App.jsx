import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginOptions from './screens/LoginOptions';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Details from './screens/Details';
import ChatsScreen from './screens/ChatsScreen';
import { UserContext } from './UserContext';
import { Camera } from './Camera/Camera';



const stack = createNativeStackNavigator();

export default function App() {


  return (

    <UserContext >
      <NavigationContainer>

      <stack.Navigator initialRouteName='loginOptions'>
        <stack.Screen name="loginOptions" component={LoginOptions} options={{headerShown: false}} />
        <stack.Screen name='login' component={Login} options={{ headerShown: false }} />
        <stack.Screen name='register' component={Register} options={{ headerShown: false }} />
        <stack.Screen name='home' component={Home} options={{ headerShown: false }} />
        <stack.Screen name='details' component={Details} options={{ headerShown: false }} />
        <stack.Screen name="Chats" component={ChatsScreen}/>
      </stack.Navigator>
      
      <Camera />

    </NavigationContainer>
    </UserContext>

  );
}
