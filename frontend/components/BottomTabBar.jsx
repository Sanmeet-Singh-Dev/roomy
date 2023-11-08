import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Spaces from '../screens/Spaces';
import ListMySpace from '../screens/ListMySpace';
import ChatsScreen from '../screens/ChatsScreen';

const Tab = createBottomTabNavigator();

const BottomTabBar = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="homePage" component={Home} />
      <Tab.Screen name="Spaces" component={Spaces} />
      <Tab.Screen name="listMySpace" component={ListMySpace} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
    </Tab.Navigator>
  )
}

export default BottomTabBar

const styles = StyleSheet.create({})