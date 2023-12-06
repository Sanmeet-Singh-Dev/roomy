import {  useFonts, 
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { SafeAreaView, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
import React, { useContext , useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { IPADDRESS } from "@env"
import { UserType } from '../UserContext';
import jwt_decode from "jwt-decode";
import { ImageBackground } from 'react-native';


const ProfileScreen = () => {

  const { userId, setUserId } = useContext(UserType);
    const [userData, setUserData] = useState({});

    const navigation = useNavigation();

    let ipAdress = IPADDRESS;

    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("jwt");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
          const response = await fetch(`http://${ipAdress}:6000/api/users/users/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the token as a bearer token
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const userData = await response.json();
          setUserData(userData);
          // console.log("PROFILEPIC",userData.profilePhoto)
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
    
      fetchUserData();
    }, []);

    let [fontsLoaded] = useFonts({
      Outfit_400Regular,
      Outfit_500Medium,
      Outfit_600SemiBold,
      Outfit_700Bold,
  });

  if (!fontsLoaded) {
      return null;
  }

    //function to handle logout
    const handleLogout = async () => {
        // Send a request to the logout endpoint on your server
        try {
          const response = await fetch(`http://${ipAdress}:6000/api/users/logout`, {
            method: 'POST', // Use the appropriate HTTP method
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {

            console.log('User logged out successfully');

            try {
                await AsyncStorage.removeItem('jwt');
              } catch (error) {
                console.error('Error clearing user token from AsyncStorage:', error);
                console.log("here here in logout catch")
            }

            navigation.navigate('login');

          } else {
            // Handle logout failure
            console.error('Logout failed.');
          }
        } catch (error) {
          console.error('Error during logout:', error);
        }
    };

    const handleLocation = () => {
        console.log("Location clicked")
        navigation.navigate('location');
    };

    const handleBlockedUsers = () => {
        navigation.navigate('BlockedUsers');
    };

  return (
    <ImageBackground source={require('../assets/Account.jpg')} style={styles.background}>
        <SafeAreaView style={styles.container}>
            {/* <ScrollView>
                <Text>ProfileScreen</Text>

                <TouchableOpacity style={styles.button}>  
                    <Text style={styles.buttonText} onPress={handleBlockedUsers}>Blocked Users</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>  
                    <Text style={styles.buttonText} onPress={handleLocation}>Location</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.button}>  
                    <Text style={styles.buttonText} onPress={handleLogout}>Logout</Text>
                </TouchableOpacity>
            </ScrollView> */}
            <View style={styles.profileNameContainer}>
            {userData.profilePhoto?.[0] ? (
              <Image
                source={{ uri: userData.profilePhoto?.[0]}} 
                style={styles.image}
              />              
            ) : ( <Text>profile picture N/A</Text> )}
            <Text style={styles.profileText}>{userData.name}</Text>
            </View>
          <View style={styles.profileButton}>
          <Image
              source={require('../assets/edit-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.profileText}>Edit Personal Info</Text>
          </View>
          <View style={styles.profileButton}>
          <Image
              source={require('../assets/mylisting-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.profileText}>My Listing</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}  onPress={handleBlockedUsers}>
          <Image
              source={require('../assets/setting-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.profileText}>Blocked Users</Text>
          </TouchableOpacity>
          <View style={styles.profileButton}>
          <Image
              source={require('../assets/calender.png')}
              style={styles.icon}
            />
            <Text style={styles.profileText}>Meetings</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton}  onPress={handleLogout}>
          <Image
              source={require('../assets/logout-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.profileText}>Log Out</Text>
          </TouchableOpacity>
        </SafeAreaView>
    </ImageBackground>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'cover', // or 'contain', based on your preference
      // Other image background styles
    },
    profileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent:'center',
      backgroundColor: '#FFFF',
      padding:15,
      width:350,
      borderRadius: 10,
      margin: 10,
    },
    logoutButton:{
      flexDirection: 'row',
      alignItems: 'center',
      alignContent:'center',
      backgroundColor: '#FFFF',
      padding:15,
      width:350,
      borderRadius: 10,
      marginTop: 70,
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    icon: {
      marginRight: 15,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginLeft: 20,
      borderWidth: 3,
      borderColor: "#FF8F66"
    },
    profileNameContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    profileText: {
      marginTop:7,
      textAlign: 'right',
      fontSize: 16,
      fontFamily: 'Outfit_500Medium',
      borderWidth: 0,
    }

})