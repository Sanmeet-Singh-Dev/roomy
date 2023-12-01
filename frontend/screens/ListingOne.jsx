import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const iPAdress = IPADDRESS;

  const toggleModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalVisible(!isModalVisible);
  };

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
      // console.log('Location:', currentLocation);
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
          // console.log(firebaseImageURLs)// Store the Firebase URL
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

      const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
      const response = await fetch(`http://${iPAdress}:6000/api/users/save-list-my-space`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

      // console.log(cameraResp)

      if (!cameraResp.canceled) {
        const { uri } = cameraResp.assets[0];
        const fileName = uri.split('/').pop();

        const compressedImage = await manipulateAsync(
          uri,
          [{ resize: { width: 800, height: 800 } }],
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
        <Text style={styles.sortText}>Where is your room?</Text>
      </TouchableOpacity>
    <View style={styles.container}>
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
        <View style={styles.clickUploadContainer}>
          <TouchableOpacity onPress={handleClickImage} style={styles.pictureContainer}>
            <View style={styles.innerContainer}>
              <Image
                source={require('../assets/Camera.png')}
                style={styles.pictureImage}
              />
              <Text style={styles.pictureText}>Click a picture</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickImage} style={styles.pictureContainer}>
            <View style={styles.innerContainer}>
              <Image
                source={require('../assets/upload.png')}
                style={styles.pictureImage}
              />
              <Text style={styles.pictureText}>Add from Library</Text>
            </View>
          </TouchableOpacity>
        </View>
        {selectedImages.length > 0 && (
          <ScrollView horizontal style={styles.scroll}>
            {selectedImages.map((uri, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleModal(index)}
                style={styles.imageContainer}
              >
                <Image
                  source={{ uri }}
                  style={styles.imagePreview}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        <Modal visible={isModalVisible} transparent={true}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => toggleModal(selectedImageIndex)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImages[selectedImageIndex] }}
              style={styles.modalImage}
            />
          </View>
        </Modal>
        <View style={styles.rentalAddressContainer}>
          <Text style={styles.rentalText}>Rental Address</Text>
          <TouchableWithoutFeedback onPress={getCurrentLocation}>
            <View style={styles.buttonContainer}>
              <TextInput
                placeholder="Property Adress"
                value={address}
                onChangeText={setAddress}
                style={styles.adressTextInput}
              />

              <Image
                source={require('../assets/currentlocation.png')}
                style={styles.buttonImage}
              />

            </View>
          </TouchableWithoutFeedback>
        </View>

        <View>
          <Text style={styles.titleText}>Title</Text>
          <View>

            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.textInput}
            />
          </View>
        </View>
        <View>
          <Text style={styles.descText}>Property Description</Text>
          <View>

            <TextInput
              placeholder="Description. Word Limit 200"
              value={description}
              onChangeText={setDescription}
              style={styles.textArea}
              multiline
              numberOfLines={50} // You can adjust the number of lines you want to display
            />
          </View>
        </View>


        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={handleUpload}>Next {'>'}</Text>
        </TouchableOpacity>
        </ScrollView>
    </View>
    </View>

  );
};

export default ListingOne;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    flex: 1
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500'
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonImage: {
    width: 40, // Adjust the width according to your image size
    height: 40, // Adjust the height according to your image size
    marginRight: 1, // Add spacing between the image and text if needed
  },
  button: {
    backgroundColor: '#FF8F66',
    color: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 8,
    width:'55%',
    alignSelf: 'center'
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
    marginBottom: 26,
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
  pictureImage: {
    width: 34,
    height: 28.8,
    resizeMode: 'cover',
  },
  pictureText: {
    marginTop: 8,
    fontSize: 8,
    fontWeight: 'bold',
    color:'#9B9B9B'
  },
  pictureContainer: {
    borderWidth: 1,
    borderColor: '9B9B9B',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 50,
    width: '45%',
    marginBottom: 10
  },
  innerContainer: {
    alignItems: 'center',
  },
  clickUploadContainer: {

    flexDirection: 'row',
    justifyContent: 'space-evenly'


  },
  imagePreview: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginLeft: 10,
  },
  imageContainer: {
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scroll: {
    flex: 1
  },
  rentalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 25,
  },
  adressTextInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 26,
    padding: 10,
    width: 320
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 26,
    padding: 10,
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




})