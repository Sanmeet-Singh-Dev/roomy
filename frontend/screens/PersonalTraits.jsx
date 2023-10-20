import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '@env'
import { useNavigation } from '@react-navigation/native'

const PersonalTraits = () => {
  const [selectedTraits, setSelectedTraits] = useState([]);

  const navigation = useNavigation();

  const availableTraits = [
    'calm', 'friendly', 'organized', 'social',
    'caring', 'easy going', 'energetic',
    'relaxed', 'flexible', 'creative', 'cheerful',
    'tolerant','clean','serious',
    'active', 'balanced', 'charismatic', 'fun',
    'dramatic', 'generous', 'helpful', 'humble',
    'innovative', 'mature', 'modest',
    'reliable', 'responsible'
  ];

  const toggleTraits = (trait) => {
    if (selectedTraits.includes(trait)) {
      // If the interest is already selected, remove it
      setSelectedTraits((prevTraits) =>
        prevTraits.filter((item) => item !== trait)
      );
    } else {
      // If the interest is not selected, add it
      setSelectedTraits((prevTraits) => [...prevTraits, trait]);
    }
  };

  const handleSaveTraits = async () => {
    let ipAddress = IPADDRESS;
    console.log('handleSaveTraits run');
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
  
      const response = await fetch(`http://${ipAddress}:6000/api/users/traits`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token as a bearer token
        },
        body: JSON.stringify({
          traits: selectedTraits, // Pass the selected interests array
        }),
      });
  
      if (response.ok) {
        // Handle a successful response
        const data = await response.json();
        navigation.navigate('home');
      } else {
        // Handle an unsuccessful response (e.g., show an error message)
        console.error('Error updating traits.');
        console.log("here 2");
      }
    } catch (error) {
      // Handle fetch or AsyncStorage errors
      console.error('Error:', error);
      console.log("here 3");
    }
  };
  

  return (
    <View style={styles.containerMain}>
      <ScrollView>
      <Text>Select Your Personal Traits:</Text>
      <View style={styles.container}>

        {availableTraits.map((traits) => (
          <TouchableOpacity
            key={traits}
            style={[
              styles.option,
              selectedTraits.includes(traits) && styles.selectedOption,
            ]}
            onPress={() => toggleTraits(traits)}
          >
            <Text style={styles.optionText}>{traits}</Text>
          </TouchableOpacity>
        ))}

      </View>
      
      <Button
        title="Next"
        onPress={handleSaveTraits}
      />

    </ScrollView>

    </View>
  )
}

export default PersonalTraits

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    padding: 30,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: 'blue',
    borderColor: 'blue',
  },
  optionText: {
    color: 'black',
    textAlign: 'center',
  },
});
