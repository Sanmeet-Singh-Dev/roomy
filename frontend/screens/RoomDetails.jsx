import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '@env'
import { useNavigation } from '@react-navigation/native'


const RoomDetails = () => {
  const [availability, setAvailability] = useState('');
  const [roomSuitability, setRoomSuitability] = useState('');
  const [petFriendly, setPetFriendly] = useState('');
  const [furnished, setFurnished] = useState('');
  const [budget , setBudget] = useState('')
  const navigation = useNavigation();

  const handleSaveRoomDetails = async () => {
    let ipAddress = IPADDRESS;
    try {
      const token = await AsyncStorage.getItem('jwt');
      
      if (!token) {
        // Handle the case where the token is not available
        console.error('No authentication token available.');
        return;
      }
  
      const response = await fetch(`http://${ipAddress}:6000/api/users/update-room-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          // Include any necessary headers, like authorization tokens
        },
        body: JSON.stringify({
          availability,
          roomSuitability,
          budget: parseFloat(budget),
          petFriendly,
          furnished,
        }),
      });
  
      if (response.ok) {
        // Handle a successful response (e.g., show a success message or navigate to the next screen)
        console.log('Room details saved successfully');
        navigation.navigate('room-attributes'); // You can navigate to the next screen after a successful save
         // Make sure to import 'navigation' from React Navigation
      } else {
        // Handle an unsuccessful response (e.g., show an error message)
        console.error('Error saving room details');
        // You can display an error message to the user
      }
    } catch (error) {
      // Handle fetch or other errors
      console.error('Error:', error);
      // You can display an error message to the user
    }
  };

  const options = [
    'immediate',
    'later',
  ];

  const roomSuitabilityOptions = [
    'student',
    'professionals',
    'couples',
  ];

  const petFriendlyOptions = [
    'allowed',
    'not-allowed',
  ];

  const furnishedOptions = [
    'unfurnished',
    'fully-furnished',
    'partially-furnished',
  ];

  const renderOptionButtons = (options, selectedOption, setOption) => {
    return options.map((option) => (
      <TouchableOpacity
        key={option}
        style={[
          styles.option,
          selectedOption === option && styles.selectedOption,
        ]}
        onPress={() => setOption(option)}
      >
        <Text style={styles.optionText}>{option}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.containerMain}>
      <ScrollView>
        <Text style={styles.text}>Budget</Text>
        <TextInput  placeholder="Budget"
        value={budget}
        onChangeText={setBudget} />

        <Text style={styles.text}>Availability</Text>
        <View style={styles.container}>{renderOptionButtons(options, availability, setAvailability)}</View>

        <Text style={styles.text}>Room Suitability</Text>
        <View style={styles.container}>{renderOptionButtons(roomSuitabilityOptions, roomSuitability, setRoomSuitability)}</View>

        <Text style={styles.text}>Pet Friendly</Text>
        <View style={styles.container}>{renderOptionButtons(petFriendlyOptions, petFriendly, setPetFriendly)}</View>

        <Text style={styles.text}>Furnished</Text>
        <View style={styles.container}>{renderOptionButtons(furnishedOptions, furnished, setFurnished)}</View>

        <Button title="Next" onPress={handleSaveRoomDetails} />
      </ScrollView>
    </View>
  );
};

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
  text: {
    fontSize: 17,
    marginTop: 30,
  },
});

export default RoomDetails;
