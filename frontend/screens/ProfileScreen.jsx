import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { IPADDRESS } from "@env"

const ProfileScreen = () => {

    const navigation = useNavigation();

    let ipAdress = IPADDRESS;

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
    <View>
        <SafeAreaView>
            <ScrollView>
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

            </ScrollView>
        </SafeAreaView>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
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
})