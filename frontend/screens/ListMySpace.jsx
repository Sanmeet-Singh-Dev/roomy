import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import jwt_decode from "jwt-decode";
import * as ImagePicker from 'expo-image-picker';
import { Camera } from '../Camera/Camera';
import { UserType } from '../UserContext';
import { uploadToFirebase, listFiles } from '../firebase-config';
import { IPADDRESS } from '@env'
import * as Location from 'expo-location'

const ListMySpace = ({ onUpload, onTakePhoto }) => {
  const route = useRoute();
  const userName = route.params?.userName;
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const { userId, setUserId } = useContext(UserType);

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const iPAdress = IPADDRESS;

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("jwt");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUsers();
  }, []);

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
          .join(', ');
  
        // Update the address state with the full address
        setAddress(fullAddress);

        setLocation(location)
      } catch (error) {
        console.error('Error reverse-geocoding location:', error);
        // Handle the error as needed
      }
    }
  };


  const handleUpload = async () => {
    if (!title || !description || !budget || selectedImages.length === 0) {
      Alert.alert('Please Check Input', 'Please enter all the details and select at least one image');
      return;
    }

    try {
      // Array to store Firebase image URLs
      const firebaseImageURLs = [];

      // Function to upload a single image to Firebase and collect the URL
      const uploadImageToFirebase = async (uri) => {
        const fileName = uri.split('/').pop();
        const uploadResponse = await uploadToFirebase(uri, fileName, userId);
        if (uploadResponse) {
          firebaseImageURLs.push(uploadResponse.downloadUrl); 
          console.log(firebaseImageURLs)// Store the Firebase URL
        }
        
      };

      // Upload all selected images to Firebase concurrently
      await Promise.all(selectedImages.map(uploadImageToFirebase));
      const locationData = location
      ? {
          type: 'Point',
          coordinates: [location.coords.latitude, location.coords.longitude],
        }
      : null;

      // After all images are uploaded, you can now save the data along with image URLs
      const data = {
        userId,
        data: {
          images: firebaseImageURLs,
          title,
          description,
          budget: parseFloat(budget),
          location: locationData
        },
        
      };

      const response = await fetch(`http://${iPAdress}:6000/api/users/save-list-my-space`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert.alert('Success', 'Details saved successfully');
      } else {
        const responseData = await response.json();
        Alert.alert('Error', responseData.message || 'Failed to save details.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to save details: ' + error.message);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        const fileName = uri.split('/').pop();
        setSelectedImages([...selectedImages, uri]);
        // const uploadResponse = await uploadToFirebase(uri, fileName, userId);
        // Alert.alert('Success Picture uploaded successfully');
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
      Alert.alert('Error', `Failed to pick an image from the library: ${error.message}`);
    }
  };


  return (
    <View>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Budget"
        value={budget}
        onChangeText={setBudget}
      />

      <ScrollView horizontal>
        {selectedImages.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width: 100, height: 100, marginRight: 10 }}
          />
        ))}
      </ScrollView>
      <Camera userId={userId} />
      <Button title="Pick from Library" onPress={handlePickImage} />
      <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
      <Button title="Use Current Location" onPress={getCurrentLocation} />
      <Button title="Submit" onPress={handleUpload} />
    </View>
  );
};

export default ListMySpace;
