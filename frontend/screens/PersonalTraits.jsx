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

const PersonalTraits = () => {
  const [selectedTraits, setSelectedTraits] = useState([]);

  const navigation = useNavigation();
  const currentStep = 5;
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
   
    try {
      // Get the authentication token from AsyncStorage

      const token = await AsyncStorage.getItem('jwt');

      if (!token) {
        // Handle the case where the token is not available
        console.error('No authentication token available.');
        return;
      }
  
      const response = await fetch(`https://roomyapp.ca/api/api/users/traits`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token as a bearer token
        },
        body: JSON.stringify({
          traits: selectedTraits,
        }),
      });
  
      if (response.ok) {
        // Handle a successful response
        const data = await response.json();
        const userName = data.name;
        navigation.navigate('profileCreated', { userName: userName });
      } else {
        // Handle an unsuccessful response (e.g., show an error message)
        console.error('Error updating traits.');
      
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
        <Text style={styles.sortText}>Your Personal Traits</Text>
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
      
      <Text style={styles.text}>Select Your Personal Traits:</Text>
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
            <Text style={[styles.optionText, { color: selectedTraits.includes(traits) ? 'white' : 'black' }, ]}>{traits}</Text>
          </TouchableOpacity>
        ))}

      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveTraits}>
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

export default PersonalTraits

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
  optionText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Outfit_400Regular',
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
    color: 'white'
  },
  text: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    marginLeft: 20,
    marginRight: 20,
  },
  btnContainer : {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "31%",
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
