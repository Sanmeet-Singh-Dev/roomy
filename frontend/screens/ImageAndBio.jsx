import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'

const ImageAndBio = () => {

    const [work, setWork] = useState('');
    const [bio, setBio] = useState('');

    const navigation = useNavigation();

    const handleGenderSelection = (work) => {
        setWork(work);
        console.log(work);
    };


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
        
            const response = await fetch('http://192.168.1.151:6000/api/users/bio', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token as a bearer token
              },
              body: JSON.stringify({
                work,
                bio
              }),
            });
        
            if (response.ok) {
              // Handle a successful response
              const data = await response.json();
              navigation.navigate('livinghabits');
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

            <Text>Image Component here. (To be done by Sanmeet)</Text>
            
            <Text>What do you currently do?</Text>

            <View style={styles.optionsContainer}>

                <TouchableOpacity
                    style={[
                    styles.option,
                    work === 'Working Professional' && styles.selectedOption,
                    ]}
                    onPress={() => handleGenderSelection('Working Professional')}
                >
                    <Text style={styles.optionText}>Working Professional</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                    styles.option,
                    work === 'Unemployed' && styles.selectedOption,
                    ]}
                    onPress={() => handleGenderSelection('Unemployed')}
                >
                    <Text style={styles.optionText}>Unemployed</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                    styles.option,
                    work === 'Student' && styles.selectedOption,
                    ]}
                    onPress={() => handleGenderSelection('Student')}
                >
                    <Text style={styles.optionText}>Student</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                    styles.option,
                    work === 'Business' && styles.selectedOption,
                    ]}
                    onPress={() => handleGenderSelection('Business')}
                >
                    <Text style={styles.optionText}>Business</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                    styles.option,
                    work === 'Other' && styles.selectedOption,
                    ]}
                    onPress={() => handleGenderSelection('Other')}
                >
                    <Text style={styles.optionText}>Other</Text>
                </TouchableOpacity>

            </View>

            <TextInput
              placeholder="Add a Bio:"
              value={bio}
              onChangeText={setBio}
            />

            <Button title="Next" onPress={handleSaveProfile} />
            
        </SafeAreaView>
    </View>
  )
}

export default ImageAndBio


const styles = StyleSheet.create({
    label: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    option: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
    },
    selectedOption: {
      backgroundColor: 'blue', // Change to your desired highlight color
      borderColor: 'blue', // Change to your desired highlight color
    },
    optionText: {
      color: 'black', // Change to your desired text color
      textAlign: 'center',
    },
});