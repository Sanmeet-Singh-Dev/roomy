import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'

const Location = () => {

    const [location, setLocation] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
      const getPermissions = async () => {
        let { status } = await Location.requestForegroundPermissionAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
        return;
        }

        let currentLocation = await Location.get();
      }

    }, [])
    

    const handleSaveLocation = async () => {
        try {
            const response = await fetch('http://your-backend-api-url/endpoint-for-location', {
                method: 'POST',  // Adjust the HTTP method as needed (POST, PUT, etc.)
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location,
                }),
            });

            if (response.ok) {
                // Handle a successful response (e.g., navigate to the next screen)
                navigation.navigate('NextScreen');
            } else {
                // Handle an unsuccessful response (e.g., show an error message)
                console.error('Error saving location.');
            }
        } catch (error) {
            // Handle fetch errors (e.g., network issues)
            console.error('Error:', error);
        }
    }

  return (
    <View>
        <SafeAreaView>
        
            <Text>Location:</Text>
            <TextInput
                placeholder="location"
                value={location}
                onChangeText={setLocation}
            />

            <Button title="Save Location" onPress={handleSaveLocation} />

        </SafeAreaView>
    </View>
  )
}

export default Location

const styles = StyleSheet.create({})