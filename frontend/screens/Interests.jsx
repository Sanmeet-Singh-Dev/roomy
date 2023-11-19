import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '@env'
import { useNavigation } from '@react-navigation/native'

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const navigation = useNavigation();
  const currentStep = 4;
    const steps = 6;

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
       <View style={styles.progressBar}>
      {[...Array(steps).keys()].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View
            style={[
              styles.dot,
              { backgroundColor: step <= currentStep ? '#3E206D' : 'lightgray' },
            ]}
          />
          {step < steps - 1 && <View style={styles.line} />}
        </View>
      ))}
    </View>
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
            <Text style={[styles.optionText, { color: selectedInterests.includes(interest) ? 'white' : 'black' }, ]}>{interest}</Text>
          </TouchableOpacity>
        ))}

      </View>

      <TouchableOpacity style={styles.button} onPress={handleSaveInterests}>  
          <Text style={styles.buttonText}>Next </Text>
          </TouchableOpacity>

    </ScrollView>

    </View>
  )
}

export default Interests

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: 'white'
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft: 14,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 40,
    width: '27%'
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width:15,
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
  option: {
    backgroundColor: '#EEEEEE',
    paddingVertical: 12,
    paddingHorizontal: 19,
    borderRadius: 5,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: '#FF8F66', 
    color: 'white',  
  },
  optionText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
    marginRight: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#FF8F66',
    color: '#fff',
    margin: 10,
    marginTop: 50,
    marginLeft: 96,
    marginRight: 96,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 8,
  },
});
