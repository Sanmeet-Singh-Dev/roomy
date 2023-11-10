import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginOptions from './screens/LoginOptions';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Details from './screens/Details';
import ImageAndBio from './screens/ImageAndBio';
import Livinghabits from './screens/Livinghabits';
import ChatsScreen from './screens/ChatsScreen';
import { UserContext } from './UserContext';

import ListMySpace from './screens/ListMySpace';
import { Camera } from './Camera/Camera';
import Interests from './screens/Interests';
import CalendarScreen from './screens/CalendarScreen'
import CreateMeeting from './screens/CreateMeeting';

import NewChatScreen from './screens/NewChatScreen';
import ChatMessagesScreen from './screens/ChatMessagesScreen';
import Spaces from './screens/Spaces';
import CurrentLocation from './screens/CurrentLocation';
import PersonalTraits from './screens/PersonalTraits';
import UserSingleScreen from './screens/UserSingleScreen';
import ShowNotificationScreen from './screens/ShowNotificationScreen';
import UserSortScreen from './screens/UserSortScreen';
import BottomTabBar from './components/BottomTabBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlockedUserScreen from './screens/BlockedUserScreen';
import RoomDetails from './screens/RoomDetails';
import RoomAttributes from './screens/RoomAttributes';
import SingleSpace from './screens/SingleSpace';

const stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  return (

    <UserContext >
      <NavigationContainer>

        <stack.Navigator initialRouteName='loginOptions'>
        <stack.Screen name="home" component={BottomTabBar} options={{headerShown: false}} />
        <stack.Screen name="loginOptions" component={LoginOptions} options={{headerShown: false}} />
        <stack.Screen name='login' component={Login} options={{ headerShown: false }} />
        <stack.Screen name='register' component={Register} options={{ headerShown: false }} />
        {/* <stack.Screen name='home' component={Home} options={{ headerShown: false }} /> */}
        <stack.Screen name="location" component={CurrentLocation}/>
        <stack.Screen name='details' component={Details} options={{ headerShown: false }} />
        <stack.Screen name='imageAndBio' component={ImageAndBio} options={{ headerShown: false }} />
        <stack.Screen name='livinghabits' component={Livinghabits} options={{ headerShown: false }} />
        <stack.Screen name='interests' component={Interests} options={{ headerShown: false }} />
        <stack.Screen name='personalTraits' component={PersonalTraits} options={{ headerShown: false }} />
        <stack.Screen name='userSingleScreen' component={UserSingleScreen} options={{ headerShown: false }} />
        <stack.Screen name='userSortScreen' component={UserSortScreen} options={{ headerShown: false }} />
        <stack.Screen name="Chats" component={ChatsScreen}/>
        <stack.Screen name="newChat" component={NewChatScreen} />
        <stack.Screen name="Messages" component={ChatMessagesScreen} />       
        <stack.Screen name="listMySpace" component={ListMySpace}/>
        <stack.Screen name="room-attributes" component={RoomAttributes}/>
        <stack.Screen name="single-space" component={SingleSpace}/>
        <stack.Screen name="room-details" component={RoomDetails}/>
        <stack.Screen name="Calendar" component={CalendarScreen} />
        <stack.Screen name="CreateMeeting" component={CreateMeeting} options={{ headerShown: false }} />
        <stack.Screen name="Spaces" component={Spaces}/>
        <stack.Screen name="Notifications" component={ShowNotificationScreen} />
        <stack.Screen name="BlockedUsers" component={BlockedUserScreen} />
      </stack.Navigator>
      
    </NavigationContainer>
    </UserContext>

  );
}
