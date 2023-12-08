import {  useFonts, 
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '@env'
import { useNavigation } from '@react-navigation/native'

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const navigation = useNavigation();
  const currentStep = 4;
    const steps = 6;

    let [fontsLoaded] = useFonts({
      Outfit_400Regular,
      Outfit_500Medium,
      Outfit_600SemiBold,
      Outfit_700Bold,
  });

  if (!fontsLoaded) {
      return null;
  }

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
  
      const response = await fetch(`http://roomyapp.ca/api/api/users/interests`, {
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

  const handleBack = () => {
    navigation.goBack();
  }
  

  return (
    <View style={styles.containerMain}>
      <SafeAreaView>
       <ScrollView>
      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
          source={require('../assets/back.png')}
          style={styles.sortIcon}
        />
        <Text style={styles.sortText}>Your Interests</Text>
      </TouchableOpacity>
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
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSaveInterests}>
              <Text style={styles.buttonText}>Next</Text>
              <Image
              source={require('../assets/Horizontal.png')}
              style={styles.nextIcon}
              />
            </TouchableOpacity>
          </View>

  </ScrollView>
  </SafeAreaView>
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
    backgroundColor: 'lightgray',
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
    fontSize: 17,
    fontFamily: 'Outfit_400Regular',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
    marginRight: 20,
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
  },
  btnContainer : {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "8%",
},
button: {
    backgroundColor: '#51367B',
    color: '#fff',
    marginTop: 30,
    paddingHorizontal: 60,
    paddingVertical: 17,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
},
buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: "400",
},
nextIcon: {
    width: 23,
    height: 23,
},
  backIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: "2%",
    marginLeft: "2%",
  },
  sortIcon: {
    width: 30,
    height: 30,
    margin: 5,
  },
  sortText: {
    fontSize: 18,
    fontFamily: 'Outfit_500Medium',
  },
});
