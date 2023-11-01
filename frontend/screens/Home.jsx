import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import jwt_decode from "jwt-decode";
import { Ionicons } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import UserCard from '../components/UserCard';
import { Camera } from '../Camera/Camera';

const Home = () => {
    const route = useRoute();
    const userName = route.params?.userName;
    const navigation = useNavigation();
    let ipAdress = IPADDRESS;
    const [compatibilityData, setCompatibilityData] = useState([]);
    const userDataArray = [];
    
    const { userId, setUserId } = useContext(UserType);
    useEffect(() => {
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
      fetchCompatibleUsers()
  }, []);

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

    const handleListMySpace = () => {
      console.log("List my Space Clicked")
      navigation.navigate('listMySpace');
    }

    const handleLocation = () => {
      console.log("Location clicked")
      navigation.navigate('location');
    }

    const handleSpaces = () => {
      console.log("Spaces Clicked")
      navigation.navigate('Spaces');
    }

    const handleNotification = () => {
      navigation.navigate('Notification');
    }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>

          <Text style={styles.nameText}>Hello, {userName}</Text>

          <Ionicons 
            onPress={() => navigation.navigate("Chats")}
            name="chatbox-ellipses-outline" size={24} color="black" />


          {/* <Button
              title="Logout"
              onPress={handleLogout}
          /> */}
          <TouchableOpacity style={styles.button}>  
            <Text style={styles.buttonText} onPress={handleLogout}>Logout</Text>
            </TouchableOpacity>

          {/* <Button
              title="Location"
              onPress={handleLocation}
          /> */}
          <TouchableOpacity style={styles.button}>  
            <Text style={styles.buttonText} onPress={handleLocation}>Location</Text>
            </TouchableOpacity>

          {/* <Button
              title="List My Space"
              onPress={handleListMySpace}
          /> */}
             <TouchableOpacity style={styles.button}>  
            <Text style={styles.buttonText} onPress={handleListMySpace}>List My Space</Text>
            </TouchableOpacity>

          {/* <Button
              title="Spaces"
              onPress={handleSpaces}
          /> */}
          <TouchableOpacity style={styles.button}>  
            <Text style={styles.buttonText} onPress={handleSpaces}>Spaces</Text>
            </TouchableOpacity>

          {/* <Button
            title="Notification"
            onPress={handleNotification}
        />  */}
               <TouchableOpacity style={styles.button}>  
            <Text style={styles.buttonText} onPress={handleNotification}>Notification</Text>
            </TouchableOpacity> 

        <Text style={styles.text}>Welcome to the Home Screen</Text>

        {compatibilityData.map((userData, index) => (
          <UserCard key={index} userData={userData} />
        ))}
        <Camera userId={userId} />
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
nameText: {
  fontSize: 17,
  marginBottom: 10,
  marginTop: 20
}
})