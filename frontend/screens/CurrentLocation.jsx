
import React, { useContext,useState, useEffect } from 'react';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { IPADDRESS } from '@env'
import { UserType } from '../UserContext';


const CurrentLocation = () => {

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const ipAdress=IPADDRESS;
  const { userId, setUserId } = useContext(UserType);

  console.log("User id", userId);

  const geoCode = async () => {
    // Use the address entered by the user
    const geoCodedLocation = await Location.geocodeAsync(address);
    console.log('Geocoded Address:');
    console.log(geoCodedLocation);

    // Send this custom location data to your backend
    sendLocationDataToBackend({
      type: 'Point',
      coordinates: [geoCodedLocation[0].longitude, geoCodedLocation[0].latitude],
    });
  };

//   const getCurrentLocation = async () => {
//     // Get the current location
//     if (location) {
//       // Send the current location to your backend
//       sendLocationDataToBackend({
//         type: 'Point',
//         coordinates: [location.coords.longitude, location.coords.latitude],
//       });
//     }
//   };

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
        console.log(ipAdress);
      const response = await fetch(`http://${ipAdress}:6000/api/users/set-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: locationData,
          userId
        }),
      });

      if (response.ok) {
        // Handle a successful response (e.g., navigate to the next screen)
        navigation.navigate('home');
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

  // ... (previous code)

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
      console.log('Location:', currentLocation);
    };
    getPermissions();
  }, []);

  return (
    <View>
      <SafeAreaView>
        <Text>Select your current location or type manually the address and country name:</Text>
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />

        <Button title="Save Location" onPress={geoCode} />
        <Button title="Use Current Location" onPress={getCurrentLocation} />
        {/* <Button title="Save Location" onPress={saveLocation} /> */}
      </SafeAreaView>
    </View>
  );
};

export default CurrentLocation;
