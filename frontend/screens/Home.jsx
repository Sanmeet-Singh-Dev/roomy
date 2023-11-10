import { Button, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, Image} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
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
    const navigation = useNavigation();
    let ipAdress = IPADDRESS;
    const [compatibilityData, setCompatibilityData] = useState([]);
    const [searchValue ,  setSearchValue ] = useState("");
    const [filteredData , setFilteredData ] = useState("");
    const { userId, setUserId } = useContext(UserType);
    const [userData, setUserData] = useState({});
    const { expoPushToken, setExpoPushToken } = useContext(UserType);
    const  [notifications , setNotifications ] = useState([]);

    const [sortingGender, setSortingGender] = useState('Male');
    const [sortingBudget, setSortingBudget] = useState([0, 10000]);
    const [sortingWork, setSortingWork] = useState('Student');
    const [sortingPets, setSortingPets] = useState('Yes');

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
    }, []);

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
      const response = await fetch(`http://${ipAdress}:6000/api/users/compatibility`, {
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

const fetchUserData = async () => {
  try {
    const response = await fetch(`http://${ipAdress}:6000/api/users/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await response.json();
    setUserData(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

if(userId !== null && userId !== undefined && userId !== ""){
  fetchUserData();
}

  // console.log("User data profile photo is: ",userData.profilePhoto?.[0])

  const fetchNotifications = async (userId) => {
    try {
        const response = await fetch(`http://${ipAdress}:6000/api/users/notification/${userId}`)
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
        const response = await fetch(`http://${ipAdress}:6000/api/users/deleteNotification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>

          <Ionicons 
            onPress={() => navigation.navigate("Notifications")}
            name="notifications" size={24} color="black" style={styles.notificationIcon}
          />

          <View style={styles.header}>
            <View>
              <Text style={styles.nameText}>Hello, {userName}!</Text>
              <Text style={styles.tagline}>Let's find the perfect room-mate for you ?</Text>
            </View>
            {userData.profilePhoto?.[0] ? (
              <Image
                source={{ uri: userData.profilePhoto?.[0]}} 
                style={styles.image}
              />              
            ) : ( <Text>profile picture N/A</Text> )}

          </View>

          <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>

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

            <TouchableOpacity onPress={handleReset} style={styles.iconContainer}>
                <Image
                  source={require('../assets/filter-add.png')}
                  style={styles.sortIcon}
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
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold'
  },
  notificationIcon: {
    alignSelf: "flex-end",
    marginRight: 10,
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
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
    width: '60%',
  },
  input: {
    flex: 1,
    paddingVertical: 2,
    backgroundColor: 'transparent',
  },
  searchIcon: {
    width: 30,
    height: 30,
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
  sortIcon: {
    width: 30,
    height: 30,
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginLeft: 5,
    marginRight: 5,
    padding: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  }
})