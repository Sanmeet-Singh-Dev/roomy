import {  useFonts, 
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { Button, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, Image} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native'
import jwt_decode from "jwt-decode";
import { Ionicons } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import UserCard from '../components/UserCard';
import { TextInput } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ImageBackground } from 'react-native';
import UserInfo from '../components/UserInfo';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Home = () => {
    const route = useRoute();
    const userName = route.params?.userName;
    let reloadPage = route.params?.isReload;
    const navigation = useNavigation();
    let ipAdress = IPADDRESS;
    const [compatibilityData, setCompatibilityData] = useState([]);
    const [searchValue ,  setSearchValue ] = useState("");
    const [filteredData , setFilteredData ] = useState("");
    const { userId, setUserId } = useContext(UserType);
    const { expoPushToken, setExpoPushToken } = useContext(UserType);
    const  [notifications , setNotifications ] = useState([]);

    const [sortingGender, setSortingGender] = useState('Male');
    const [sortingBudget, setSortingBudget] = useState([0, 10000]);
    const [sortingWork, setSortingWork] = useState('Student');
    const [sortingPets, setSortingPets] = useState('Yes');
    const isFocused = useIsFocused(); 

    const onApplySorting = (sortingGender, sortingBudget, sortingWork, sortingPets) => {
      // Create a copy of the original data to avoid mutating it
      let filteredData = [...compatibilityData];
    
      if (sortingGender) {
        filteredData = filteredData.filter((item) => item.user.gender === sortingGender);
      }
    
      if (sortingWork) {
        filteredData = filteredData.filter((item) => item.user.work === sortingWork);
      }
    
      if (sortingBudget[0] || sortingBudget[1]) {
        filteredData = filteredData.filter((item) => {
          const budgetInRange =
            (!sortingBudget[0] || item.user.budget >= sortingBudget[0]) &&
            (!sortingBudget[1] || item.user.budget <= sortingBudget[1]);
          return budgetInRange;
        });
      }
    
      if (sortingPets) {
        filteredData = filteredData.filter((item) => item.user.pets === sortingPets);
      }

      // console.log(filteredData);
    
      // Update the compatibilityData state with the filtered data
      setCompatibilityData(filteredData);
    };
    
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    }, []);

   

    async function registerForPushNotificationsAsync() {
      let token;
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
    
        const projectId = Constants.expoConfig?.extra?.eas.projectId;
        token = (await Notifications.getExpoPushTokenAsync({ projectId: projectId })).data;
        console.log(token);
      } else {
        alert('Must use physical device for Push Notifications');
      }
    
      return token;
    }

    useEffect(() => {
     handleCompatibility();
    }, [reloadPage,isFocused]);

  const handleCompatibility = () => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("jwt");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
  
  //fucntion to fetch all users and compatibility percentage
  const fetchCompatibleUsers = async () => {
    try {
      // Get the authentication token from AsyncStorage
      const token = await AsyncStorage.getItem('jwt');
      
      if (!token) {
        // Handle the case where the token is not available
        console.error('No authentication token available.');
        return;
      }
  
      //sending request to API to get all users
      const response = await fetch(`https://roomyapp.ca/api/api/users/compatibility`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token as a bearer token
        },
      });
  
      if (response.ok) {
        // Handle a successful response
        const data = await response.json();
        setCompatibilityData(data);
      } else {
        // Handle an unsuccessful response (e.g., show an error message)
        console.error('Error fetching users.');
      }
    } catch (error) {
      // Handle fetch or AsyncStorage errors
      console.error('Error:', error);
    }
  }
  
  fetchUsers();
  fetchCompatibleUsers();
  
}

  const fetchNotifications = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
        const response = await fetch(`https://roomyapp.ca/api/api/users/notification/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token as a bearer token
          }
        })
        const data = await response.json();
        if (response.ok) {
            setNotifications(data);
        }
        else {
            console.log("error showing notifications", response.status.message);
        }
    }
    catch (error) {
        console.log("Error fetching notifications", error)
    }
}
useEffect(() => {
      fetchNotifications(userId);
      sendNotification(notifications);
}, [notifications, userId]);

const sendNotification = () => {
notifications.map((notification) => {
  schedulePushNotification(notification);
  })
}

let [fontsLoaded] = useFonts({
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
});

if (!fontsLoaded) {
  return null;
}

async function schedulePushNotification(notification) {
  if(notification.isNotified === false){
    deleteNotification(notification._id);
    await Notifications.scheduleNotificationAsync({
        content: {
          title: "Roomy Notification! 📬",
          body: notification.message
        },
        trigger: { seconds: 2 },
      });
    }
  }

  const deleteNotification = async (id) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
        const response = await fetch(`https://roomyapp.ca/api/api/users/deleteNotification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id : id })
        });

        if (response.ok) {
          // console.log("Notification deleted.")
        }
        else {
            console.log("Error in deleting notification", response.status);
        }
    } catch (error) {
        console.log("Error in deleting notificatioon", error);
    }
}

    const handleSort = () => {
      navigation.navigate('userSortScreen', { onApplySorting: onApplySorting });
    }

    const handleListMySpace = () => {
      console.log("List my Space Clicked")
      navigation.navigate('listMySpace');
    }

    const handleSpaces = () => {
      console.log("Spaces Clicked")
      navigation.navigate('Spaces');
    }

    const handleSearch = () => {
      const searchResults = compatibilityData.filter(user => user.user.name.toLowerCase().includes(searchValue.toLowerCase()));
      setFilteredData(searchResults);
    }

    const handleReset = () => {
      setFilteredData("");
      handleCompatibility();
    }

  return (
    <ImageBackground source={require('../assets/spaces.jpg')} style={styles.background}>
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>

          <View style={styles.locationandNotication}>
            <View style={styles.locationContainer}>
              <Image
                  source={require('../assets/currentlocation.png')}
                  style={styles.locationIcon}
                />
                <Text style={styles.locationText}>Downtown, Vancouvcer</Text>
            </View>

          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                <Image
                  source={require('../assets/notificationIcon.png')}
                  style={styles.notificationIcon}
                />
          </TouchableOpacity>
          </View>

          <View style={styles.header}>
           <UserInfo userId={userId}/>
          </View>
          
          <View style={styles.searchSortContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={searchValue}
                onChangeText={text => setSearchValue(text)}
                placeholder="Search"
              />

              <TouchableOpacity onPress={handleSearch}>
                <Image
                  source={require('../assets/search-zoom-in.png')}
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={()=> handleSort(onApplySorting)} style={styles.iconContainer}>
                <Image
                  source={require('../assets/filter-add.png')}
                  style={styles.sortIcon}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleReset} style={styles.resetIconContainer}>
                <Image
                  source={require('../assets/clear.png')}
                  style={styles.resetIcon}
                />
            </TouchableOpacity>
          </View>

          <View style={styles.cardsContainer}>
            {
              filteredData == "" ? (
                compatibilityData.map((userData, index) => (
                  <UserCard key={index} userData={userData} />
                ))
              ) : (
                filteredData.map((userData, index) => (
                  <UserCard key={index} userData={userData} />
                ))
                )
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
    </ImageBackground>
  )
}

export default Home

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  locationandNotication: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  locationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-start",
  },
  locationIcon: {
    width: 25,
    height: 25,
  },
  locationText: {
    fontSize: 19,
    fontFamily: 'Outfit_400Regular',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold'
  },
  notificationIcon: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    color: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  text: {
    fontSize: 17,
    marginTop: 20,
    textAlign: 'center'
  },
  nameText: {
    fontSize: 23,
    marginTop: 20,
  },
  tagline: {
    fontSize: 13,
    color: '#797979',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold'
  },
  button: {
      backgroundColor: '#007AFF',
      color: '#fff',
      margin: 10,
      padding: 10,
      borderRadius: 8,
  },
  text: {
    fontSize: 17,
    marginTop: 20,
    textAlign: 'center'
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginLeft: 20,
    borderWidth: 3,
    borderColor: "#FF8F66"
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: '#FFFFFF',
    width: '65%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    height: "80%",
    // elevation: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    fontFamily: 'Outfit_400Regular',
  },
  searchIcon: {
    width: 27,
    height: 27,
    marginLeft: 10,
    marginRight: 10,
  },
  searchSortContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  resetIconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginLeft: 5,
    marginRight: 5,
    paddingHorizontal: 13,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortIcon: {
    width: 24,
    height: 24,
  },
  resetIcon: {
    width: 18,
    height: 18,
  },
  resetText: {
    fontSize: 12,
    marginTop: 2,
    color: '#51367B',
    fontWeight: '500',
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginLeft: 5,
    marginRight: 5,
    paddingHorizontal: 11,
    paddingVertical: 9.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  }
})