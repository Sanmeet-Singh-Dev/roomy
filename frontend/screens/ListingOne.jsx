import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, Image, ScrollView, StyleSheet , TouchableOpacity, TouchableWithoutFeedback, Modal} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import jwt_decode from "jwt-decode";
import * as ImagePicker from 'expo-image-picker';
import { UserType } from '../UserContext';
import { uploadToFirebase, listFiles } from '../firebase-config';
import { IPADDRESS } from '@env'
import * as Location from 'expo-location'
import { manipulateAsync } from 'expo-image-manipulator';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground } from 'react-native';
const currentStep = 0;
const steps = 3;



const ListingOne = ({ onUpload, onTakePhoto }) => {
  const route = useRoute();
  const userName = route.params?.userName;
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [showModal, setShowModal] = useState(false);

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
    if (!title || !description || selectedImages.length === 0) {
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
        navigation.navigate('room-details');
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
        const compressedImage = await manipulateAsync(
          uri,
          [{ resize: { width: 800, height: 600 } }],
          { format: 'jpeg', compress: 0.8 }
        );
        setSelectedImages([...selectedImages, compressedImage.uri]);
        // const uploadResponse = await uploadToFirebase(uri, fileName, userId);
        // Alert.alert('Success Picture uploaded successfully');
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
      Alert.alert('Error', `Failed to pick an image from the library: ${error.message}`);
    }
  };

   const handleClickImage = async () => {
   

    try {
      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1

      });

      console.log(cameraResp)

      if (!cameraResp.canceled) {
        const { uri } = cameraResp.assets[0];
        const fileName = uri.split('/').pop();

        const compressedImage = await manipulateAsync(
          uri,
          [{ resize: { width: 800, height: 600 } }],
          { format: 'jpeg', compress: 0.6 }
        );

        setSelectedImages([...selectedImages, compressedImage.uri]);
        // const uploadResponse = await uploadToFirebase(uri, fileName, userId);
        // Alert.alert('Success Picture uploaded successfully');
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
      Alert.alert('Error', `Failed to pick an image from the library: ${error.message}`);
    }



 }

 if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
  return (
    <View style={styles.container}>
      <Text>Permission Not Granted {permission?.status}</Text>
      <StatusBar style="auto" />
      <Button title="Request Camera Permission" onPress={requestPermission}></Button>
    </View>
  )
}



  return (
    <View>
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
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.textInput}
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
      <TouchableOpacity style={styles.button}>  
            <Text style={styles.buttonText} onPress={handleClickImage}>Click a Picture</Text>
          </TouchableOpacity>
      <TouchableOpacity style={styles.button}>  
            <Text style={styles.buttonText} onPress={handlePickImage}>Pick from Library</Text>
          </TouchableOpacity>
    
         {/* <TouchableOpacity style={styles.button}>  
            <Text style={styles.buttonText} onPress={getCurrentLocation}>Use Current Location</Text>
          </TouchableOpacity>*/}
          <TouchableWithoutFeedback onPress={getCurrentLocation}>
      <View style={styles.buttonContainer}>
        <Image
          source={require('../assets/currentlocation.png')}
          style={styles.buttonImage}
        />
          <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          style={styles.textInput}
        />
      </View>
    </TouchableWithoutFeedback>
      <TouchableOpacity style={styles.button}>   
            <Text style={styles.buttonText} onPress={handleUpload}>Next</Text>
          </TouchableOpacity>

    </View>
    
  );
};

export default ListingOne;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 30,
  },
  buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 17,
      fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonImage: {
    width: 24, // Adjust the width according to your image size
    height: 24, // Adjust the height according to your image size
    marginRight: 10, // Add spacing between the image and text if needed
  },
  button: {
      backgroundColor: '#007AFF',
      color: '#fff',
      margin: 10,
      padding: 10,
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
      margin: 10,
      padding: 10,
  },
  label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
      marginRight: 10,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 40,
    width: '90%'
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
  }
})