import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '@env'
import { useNavigation } from '@react-navigation/native'

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const navigation = useNavigation();

  const availableInterests = [
    'music', 'dance', 'travel', 'art',
    'photography', 'running', 'cook',
    'bake', 'basketball', 'yoga', 'tv',
    'hiking','swimming','fashion',
    'netflix', 'gym', 'films', 'tennis',
    'design', 'ted', 'writing', 'party',
    'soccer', 'draw', 'climbing',
    'fitness', 'singing', 'video games',
    'shopping', 'outing', 'sports'
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      // If the interest is already selected, remove it
      setSelectedInterests((prevInterests) =>
        prevInterests.filter((item) => item !== interest)
      );
    } else {
      // If the interest is not selected, add it
      setSelectedInterests((prevInterests) => [...prevInterests, interest]);
    }
  };

  const handleSaveInterests = async () => {
    let ipAddress = IPADDRESS;
   
    try {
      // Get the authentication token from AsyncStorage

      const token = await AsyncStorage.getItem('jwt');
  
      if (!token) {
        // Handle the case where the token is not available
        console.error('No authentication token available.');
        return;
      }
  
      const response = await fetch(`http://${ipAddress}:6000/api/users/interests`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token as a bearer token
        },
        body: JSON.stringify({
          interests: selectedInterests, // Pass the selected interests array
        }),
      });
  
      if (response.ok) {
        // Handle a successful response
        const data = await response.json();
        navigation.navigate('personalTraits');
      } else {
        // Handle an unsuccessful response (e.g., show an error message)
        console.error('Error updating interests.');
      
      }
    } catch (error) {
      // Handle fetch or AsyncStorage errors
      console.error('Error:', error);

    }
  };
  

  return (
    <View style={styles.containerMain}>
      <ScrollView>
      <Text style={styles.text}>Select Your Interests:</Text>
      
      <View style={styles.container}>
        {availableInterests.map((interest) => (
          <TouchableOpacity
            key={interest}
            style={[
              styles.option,
              selectedInterests.includes(interest) && styles.selectedOption,
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text style={styles.optionText}>{interest}</Text>
          </TouchableOpacity>
        ))}

      </View>
      <Button
        title="Next"
        onPress={handleSaveInterests}
      />

    </ScrollView>

    </View>
  )
}

export default Interests

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    padding: 30,
  },
  container: {
    flexDirection: 'row', // Set the flexDirection to 'row' for horizontal layout
    flexWrap: 'wrap', // Allow elements to wrap to the next line
    justifyContent: 'flex-start',
     // Align elements to the left
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5, // Adjust vertical padding
    paddingHorizontal: 10, // Adjust horizontal padding
    borderRadius: 5,
    margin: 5, // Add margin to separate the options
  },
  selectedOption: {
    backgroundColor: 'blue', // Change to your desired highlight color
    borderColor: 'blue', // Change to your desired highlight color
  },
  optionText: {
    color: 'black', // Change to your desired text color
    textAlign: 'center',
  },
  text: {
    fontSize: 17,
    marginTop: 30,
  },
});
