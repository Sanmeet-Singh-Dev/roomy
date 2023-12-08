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
          let customSize = size;

          if (route.name === 'homePage') {
            iconPath = focused
              ? require('../assets/roommate-icon.png')
              : require('../assets/roommate-unfocused-icon.png');
          } else if (route.name === 'spaces') {
            iconPath = focused
              ? require('../assets/spaces-icon.png')
              : require('../assets/spaces-unfocused-icon.png');
          } else if (route.name === 'listMySpace') {
            customSize = size + 20;
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

          return <View style={{
          }}>
                  <Image source={iconPath} style={{
                    width: customSize,
                    height: customSize,

                     }} />
                </View>
        },
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 30, 
          borderTopRightRadius: 30,
          paddingVertical:15, 
          elevation: 5,
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 4,
          height: 90
        
        },
        tabBarShowLabel: false
      })}
    >
    
      <Tab.Screen name="homePage" component={Home} options={{headerShown: false, headerTitle: ""}} />
      <Tab.Screen name="spaces" component={Spaces} options={{headerShown: false, headerTitle: ''}}/>
      <Tab.Screen name="listMySpace" component={ListMySpace} options={{headerShown: false}}/>
      <Tab.Screen name="Chats" component={ChatsScreen} options={{headerShown: false}}/>
      <Tab.Screen name="profileScreen" component={ProfileScreen} options={{headerShown: false}} />
    </Tab.Navigator>
  )
}

export default BottomTabBar

const styles = StyleSheet.create({

})