import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginOptions from './screens/LoginOptions';
import Login from './screens/Login';
import Register from './screens/Register';
import Details from './screens/Details';
import ImageAndBio from './screens/ImageAndBio';
import Livinghabits from './screens/Livinghabits';
import ChatsScreen from './screens/ChatsScreen';
import { UserContext } from './UserContext';

import ListMySpace from './screens/ListMySpace';
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
import BlockedUserScreen from './screens/BlockedUserScreen';
import RoomDetails from './screens/RoomDetails';
import RoomAttributes from './screens/RoomAttributes';
import SingleSpace from './screens/SingleSpace';
import ListingOne from './screens/ListingOne';
import Splash from './screens/Splash';
import { LogBox } from 'react-native';
import ignoreWarnings from 'ignore-warnings';
import EditListing from './screens/EditListing';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

ignoreWarnings('warn',['ViewPropTypes','[react-native-gesture-handler]'])

LogBox.ignoreLogs([
	'ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from \'deprecated-react-native-prop-types\'.',
	'NativeBase: The contrast ratio of',
	"[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
])



const stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  return (

    <UserContext >
      <NavigationContainer>

        <stack.Navigator initialRouteName='splash'>
        <stack.Screen name="splash" component={Splash} options={{headerShown: false}} />
        <stack.Screen name="home" component={BottomTabBar} options={{headerShown: false}} />
        <stack.Screen name="loginOptions" component={LoginOptions} options={{headerShown: false}} />
        <stack.Screen name='login' component={Login} options={{ headerShown: false }} />
        <stack.Screen name='register' component={Register} options={{ headerShown: false }} />
        {/* <stack.Screen name='home' component={Home} options={{ headerShown: false }} /> */}
        <stack.Screen name="location" component={CurrentLocation} options={{ title:'Get your profile started' ,headerShown: true }}/>
        <stack.Screen name='details' component={Details} options={{ title:'Get your profile started' ,headerShown: true }} />
        <stack.Screen name='imageAndBio' component={ImageAndBio} options={{ title:'Image and Bio' ,headerShown: true }} />
        <stack.Screen name='livinghabits' component={Livinghabits} options={{ title:'Your Personal and living habits' ,headerShown: true }} />
        <stack.Screen name='interests' component={Interests} options={{ title:'Your Interests' ,headerShown: true }} />
        <stack.Screen name='personalTraits' component={PersonalTraits} options={{ title:'Your Personal traits' ,headerShown: true }} />
        <stack.Screen name='userSingleScreen' component={UserSingleScreen} options={{title:"Roommate Profile" , headerShown: true }} />
        <stack.Screen name='userSortScreen' component={UserSortScreen} options={{ headerShown: false }} />
        <stack.Screen name="Chats" component={ChatsScreen} options={{title:'Messages' ,headerShown: true}}/>
        <stack.Screen name="newChat" component={NewChatScreen} options={{title:'New Messages' ,headerShown: true}}/>
        <stack.Screen name="Messages" component={ChatMessagesScreen} />  
        <stack.Screen name="listingOne" component={ListingOne}/>
        <stack.Screen name="listMySpace" component={ListMySpace}/>
        <stack.Screen name="room-attributes" component={RoomAttributes}/>
        <stack.Screen name="single-space" component={SingleSpace} options={{ headerShown: false }}/>
        <stack.Screen name="room-details" component={RoomDetails}/>
        <stack.Screen name="Calendar" component={CalendarScreen} />
        <stack.Screen name="CreateMeeting" component={CreateMeeting} options={{ headerShown: false }} />
        <stack.Screen name="Spaces" component={Spaces}/>
        <stack.Screen name="Notifications" component={ShowNotificationScreen} />
        <stack.Screen name="BlockedUsers" component={BlockedUserScreen} />
        <stack.Screen name="edit-listing" component={EditListing} />
      </stack.Navigator>
      
    </NavigationContainer>
    </UserContext>

  );
}
