import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginOptions from './screens/LoginOptions';
import Login from './screens/Login';
import Register from './screens/Register';


const stack = createNativeStackNavigator();

export default function App() {


  return (
    <NavigationContainer>

      <stack.Navigator initialRouteName='loginOptions'>

        <stack.Screen name="loginOptions" component={LoginOptions} options={{ headerShown: false }} />
        <stack.Screen name='login' component={Login} options={{ headerShown: false }} />
        <stack.Screen name='register' component={Register} options={{ headerShown: false }} />


      </stack.Navigator>

    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'skyblue',
    paddingVertical: 25,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fffc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});