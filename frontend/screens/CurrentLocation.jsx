import {  useFonts, 
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, View, StyleSheet,TouchableOpacity, Image } from 'react-native';
import { useNavigation , useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { IPADDRESS } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NextButton from '../components/NextButton';

const CurrentLocation = () => {

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const ipAdress=IPADDRESS;
  const route = useRoute();
  const userId = route.params?.userId;
  const currentStep = 1;
  const steps = 6;

  const geoCode = async () => {
    

    // Use the address entered by the user
    const geoCodedLocation = await Location.geocodeAsync(address);

    // Send this custom location data to your backend
    sendLocationDataToBackend({
      type: 'Point',
      coordinates: [geoCodedLocation[0].longitude, geoCodedLocation[0].latitude],
    });
  };


const getCurrentLocation = async () => {
    if (location) {
      try {
        const [addressData] = await Location.reverseGeocodeAsync({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        });
  
        // Extract the parts of the address you want (e.g., name, street, city, etc.)
        const { name, street, city, postalCode, region, country } = addressData;
  
        // Create a full address string
        const fullAddress = [name, street, city, postalCode, region, country]
          .filter((part) => part)
          .join(', ')
  
        // Update the address state with the full address
        setAddress(fullAddress);
      } catch (error) {
        console.error('Error reverse-geocoding location:', error);
        // Handle the error as needed
      }
    }
  };

  const sendLocationDataToBackend = async (locationData) => {
    try {
        const token = await AsyncStorage.getItem('jwt');
        if (!token) {
          // Handle the case where the token is not available
          console.error('No authentication token available.');
          return;
        }

      const response = await fetch(`https://roomyapp.ca/api/api/users/set-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          location: locationData,
        }),
      });

      if (response.ok) {
        // Handle a successful response (e.g., navigate to the next screen)
        navigation.navigate('imageAndBio' , {userId : userId});
      } else {
        // Handle an unsuccessful response (e.g., show an error message)
      console.error('Error saving location. Response:', response.status , response.statusText)
      try {
        const errorMessage = await response.json();
        console.error('Error message from the server:', errorMessage);
      } catch (error) {
        console.error('No error message received from the server:', error);
      }
      }
    } catch (error) {
      // Handle fetch errors (e.g., network issues)
      console.error('Error:', error);
    }
  };

const saveLocation = () => {
    if (address) {
      // If an address is entered, geocode and save the custom location
      geoCode();
    } else if (location) {
      // If no address is entered, use the current location and save it
      getCurrentLocation();
    } else {
      // Handle the case where neither custom nor current location is available
      console.error('No location data to save.');
    }
  };
  
  // ... (remaining code)
  

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };
    getPermissions();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  }

  let [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
});

if (!fontsLoaded) {
    return null;
}


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
          source={require('../assets/back.png')}
          style={styles.sortIcon}
        />
        <Text style={styles.sortText}>Choose your Location</Text>
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
      <SafeAreaView>
        <Text style={styles.label}>Where are you looking to move to?</Text>
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          style={styles.textInput}
        />
         <TouchableOpacity style={styles.currentButton} onPress={getCurrentLocation}>  
            <Text style={styles.buttonText}>Set Current Location</Text>
            <Image
                  source={require('../assets/currentlocation.png')}
                  style={styles.locationIcon}
                />
          </TouchableOpacity>

          <NextButton onPress={geoCode} buttonText="Next" />

        {/* <Button title="Save Location" onPress={geoCode} />
        <Button title="Use Current Location" onPress={getCurrentLocation} /> */}
        {/* <Button title="Save Location" onPress={saveLocation} /> */}
      </SafeAreaView>
    </View>
  );
};

export default CurrentLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
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
  locationIcon: {
    width: 25,
    height: 25,
    marginRight: "8%"
  },
  buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 18,
      fontFamily: 'Outfit_600SemiBold',
    },
    currentButton: {
      backgroundColor: '#51367B',
      color: '#fff',
      margin: 10,
      marginTop: "4%",
      marginLeft: 80,
      marginRight: 80,
      marginBottom: "24%",
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 14,
      paddingBottom: 14,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    },
    button: {
      backgroundColor: '#51367B',
      color: '#fff',
      margin: 10,
      marginTop: "95%",
      marginLeft: 96,
      marginRight: 96,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 14,
      paddingBottom: 14,
      borderRadius: 8,
    },
    text: {
      fontSize: 25,
      marginBottom: 20,
      textAlign: 'center'
    },
    textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 16,
      marginTop: 12,
      margin: 10,
      marginLeft: 20,
      marginRight: 20,
      padding: 10,
    },
    label: {
      fontSize: 16,
      fontFamily: 'Outfit_600SemiBold',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10
    },
    backIconContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: "15%",
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
})
