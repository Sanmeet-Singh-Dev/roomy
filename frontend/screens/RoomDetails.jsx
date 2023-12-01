import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { View, Text, TouchableOpacity, Button, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '@env'
import { useNavigation } from '@react-navigation/native'
const currentStep = 1;
const steps = 3;

const RoomDetails = () => {
  const [availability, setAvailability] = useState('');
  const [roomSuitability, setRoomSuitability] = useState('');
  const [petFriendly, setPetFriendly] = useState('');
  const [furnished, setFurnished] = useState('');
  const [budget, setBudget] = useState('')
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

        navigation.navigate('room-attributes');

      } else {

        console.error('Error saving room details');

      }
    } catch (error) {

      console.error('Error:', error);

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
  const handleBack = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.mainContainer}> 
    <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
    <Image
      source={require('../assets/back.png')}
      style={styles.sortIcon}
    />
    <Text style={styles.sortText}>Cost & Availability </Text>
  </TouchableOpacity>
    <View style={styles.containerMain}>
      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
          source={require('../assets/back.png')}
          style={styles.sortIcon}
        />
        <Text style={styles.sortText}>Cost & Availability</Text>
      </TouchableOpacity>
      <View style={styles.progressBar}>
        {[...Array(steps).keys()].map((step) => (
          <View key={step} style={styles.stepContainer}>
            <View
              style={[
                styles.dot,
                { backgroundColor: step <= currentStep ? '#FF8F66' : 'lightgray' },
              ]}
            />
            {step < steps - 1 && <View style={styles.line} />}
          </View>
        ))}
      </View>
      <ScrollView>
        <View>
          <Text style={styles.text}>Rent per month</Text>
          <TextInput placeholder="Budget"
            value={budget}
            onChangeText={setBudget} style={styles.textInput} />
        </View>

        <View>
          <Text style={styles.text}>Availability</Text>
          <View style={styles.container}>{renderOptionButtons(options, availability, setAvailability)}</View>
        </View>

        <View>
          <Text style={styles.text}>Room Suitability</Text>
          <View style={styles.container}>{renderOptionButtons(roomSuitabilityOptions, roomSuitability, setRoomSuitability)}</View>
        </View>

        <View>
          <Text style={styles.text}>Pet Friendly</Text>
          <View style={styles.container}>{renderOptionButtons(petFriendlyOptions, petFriendly, setPetFriendly)}</View>
        </View>

        <View>
          <Text style={styles.text}>Furnished</Text>
          <View style={styles.container}>{renderOptionButtons(furnishedOptions, furnished, setFurnished)}</View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveRoomDetails}>
          <Text style={styles.buttonText}>Next {'>'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff'
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap:10
  },
  option: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#EEEEEE'

  },
  optionText: {
    color: 'black',
    textAlign: 'center',
  },
  selectedOption: {
    backgroundColor: '#FF8F66',
    color:'#fff'
  },
  text: {
    fontSize: 17,
    marginTop: 40,
    marginBottom: 10,
    fontWeight: '500'
  
  },
  button: {
    backgroundColor: '#FF8F66',
    color: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 8,
    width: '55%',
    alignSelf: 'center'
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    padding: 10,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
    width: '52%'
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: 'lightgray',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: 'lightgray',
    marginHorizontal: 1,
  },
  backIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: "15%",
    marginLeft: "2%",
    marginBottom: "1%",
  },
  sortText: {
    fontSize: 17,
    fontWeight: "500",
  },
  sortIcon: {
    width: 30,
    height: 30,
    margin: 5,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: "15%",
  },
});

export default RoomDetails;
