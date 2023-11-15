import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Spaces from '../screens/Spaces';
import ListMySpace from '../screens/ListMySpace';
import ChatsScreen from '../screens/ChatsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconPath;

          if (route.name === 'homePage') {
            iconPath = focused
              ? require('../assets/roommate-icon.png')
              : require('../assets/roommate-unfocused-icon.png');
          } else if (route.name === 'Spaces') {
            iconPath = focused
              ? require('../assets/spaces-icon.png')
              : require('../assets/spaces-unfocused-icon.png');
          } else if (route.name === 'listMySpace') {
            iconPath = focused
              ? require('../assets/list-space-icon.png')
              : require('../assets/listing-unfocused-icon.png');
          } else if (route.name === 'Chats') {
            iconPath = focused
              ? require('../assets/chat-icon.png')
              : require('../assets/chat-unfocused-icon.png');
          } else if (route.name === 'profileScreen') {
            iconPath = focused
              ? require('../assets/profile-icon.png')
              : require('../assets/profile-unfocused-icon.png');
          }

          return <Image source={iconPath} style={{ width: size, height: size }} />;
        },
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: 'white',
          borderRadius: 50,
          padding: 40, 
        },
      })}
    >
    
      <Tab.Screen name="homePage" component={Home} options={{headerShown: false}} />
      <Tab.Screen name="Spaces" component={Spaces} />
      <Tab.Screen name="listMySpace" component={ListMySpace} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="profileScreen" component={ProfileScreen} options={{headerShown: false}} />
    </Tab.Navigator>
  )
}

export default BottomTabBar

const styles = StyleSheet.create({

})