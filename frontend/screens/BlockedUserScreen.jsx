import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import { IPADDRESS } from "@env"
import BlockedUserCard from '../components/BlockedUserCard';

const BlockedUserScreen = () => {

    const ipAdress = IPADDRESS;
    const { userId, setUserId } = useContext(UserType);
    const [ blockedUsers , setBlockedUsers ] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchBlockedUsers();
    },[])

    const fetchBlockedUsers = async () => {
        try {
          // Get the authentication token from AsyncStorage
          const token = await AsyncStorage.getItem('jwt');
          
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
      
          //sending request to API to get all users
          const response = await fetch(`http://roomyapp.ca/api/api/users/getBlockedUsers`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the token as a bearer token
            },
          });
      
          if (response.ok) {
            const data = await response.json();
            setBlockedUsers(data);
          } else {
            // Handle an unsuccessful response (e.g., show an error message)
            console.error('Error fetching users.');
          }
        } catch (error) {
          // Handle fetch or AsyncStorage errors
          console.error('Error:', error);
        }
      }

      const handleBack = () => {
        navigation.goBack();
      }
    

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
          source={require('../assets/back.png')}
          style={styles.sortIcon}
        />
        <Text style={styles.sortText}>Blocked Users</Text>
      </TouchableOpacity>
      {blockedUsers.map((userData, index) => (
        <BlockedUserCard key={index} userData={userData} />
      ))}
      </View>
  )
}

export default BlockedUserScreen

const styles = StyleSheet.create({
  backIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: "15%",
    marginLeft: "1%",
    marginBottom: "5%",
  },
  sortIcon: {
    width: 30,
    height: 30,
    margin: 5,
  },
  sortText: {
    fontSize: 17,
    fontWeight: "500",
  },
})