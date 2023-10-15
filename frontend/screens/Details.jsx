import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Details = () => {
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
  
    const handleSaveProfile = async () => {
      console.log('handleSaveProfile run');
        try {
          // Get the authentication token from AsyncStorage
          console.log('in try');
          const token = await AsyncStorage.getItem('jwt');
          console.log(token);
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
      
          const response = await fetch('http://localhost:6000/api/users/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the token as a bearer token
            },
            body: JSON.stringify({
              fullName,
              gender,
              dateOfBirth,
            }),
          });
      
          if (response.ok) {
            // Handle a successful response
            const data = await response.json();
            console.log('Profile updated:', data);
          } else {
            // Handle an unsuccessful response (e.g., show an error message)
            console.error('Error updating profile.');
            console.log("here 2")
          }
        } catch (error) {
          // Handle fetch or AsyncStorage errors
          console.error('Error:', error);
          console.log("here 3")
        }
    };
  
    return (
      <View>
        <SafeAreaView>
        <Text>Profile Details</Text>
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
        />
        <TextInput
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        />
        {/* Add input fields for other profile details here */}
        <Button title="Save Profile" onPress={handleSaveProfile} />
        </SafeAreaView>
      </View>
    );
};
  

export default Details

const styles = StyleSheet.create({})