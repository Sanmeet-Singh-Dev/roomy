import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import jwt_decode from "jwt-decode";
import { Ionicons } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"



const Home = () => {
    const route = useRoute();
    const userName = route.params?.userName;
    const navigation = useNavigation();
    let ipAdress = IPADDRESS;
    
    const { userId, setUserId } = useContext(UserType);
    useEffect(() => {
      const fetchUsers = async () => {
          const token = await AsyncStorage.getItem("jwt");
          const decodedToken = jwt_decode(token);
          const userId = decodedToken.userId;
          setUserId(userId);
      };

      fetchUsers();
  }, []);
    
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

  return (
    <View>
        <SafeAreaView>
        <Text>Hello, {userName}</Text>

        <Ionicons 
          onPress={() => navigation.navigate("Chats")}
          name="chatbox-ellipses-outline" size={24} color="black" />


        <Button
            title="Logout"
            onPress={handleLogout}
        />

<Button
            title="Location"
            onPress={handleLocation}
        />

        <Button
            title="List My Space"
            onPress={handleListMySpace}
        />
         <Button
            title="Spaces"
            onPress={handleSpaces}
        />
    

        </SafeAreaView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})