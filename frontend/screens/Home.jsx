import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'

const Home = () => {
    const route = useRoute();
    const userName = route.params?.userName;
    const navigation = useNavigation();
    
    const handleLogout = async () => {
        // Send a request to the logout endpoint on your server
        try {
          const response = await fetch('http://192.168.1.151:6000/api/users/logout', {
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

  return (
    <View>
        <SafeAreaView>
        <Text>Hello There, {userName}</Text>

        <Button
            title="Test Logout"
            onPress={handleLogout}
        />

        </SafeAreaView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})