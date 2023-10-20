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

const ListMySpace = ({ onUpload, onTakePhoto }) => {
  const route = useRoute();
  const userName = route.params?.userName;
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const { userId, setUserId } = useContext(UserType);
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

  // const handleUpload = async () => {
  //   if (!title || !description || !budget) {
  //     Alert.alert('Please Check Input', 'Please enter all the details and select at least one image');
  //   return;
  //   }
  //   try {
  //     const data = {
  //       userId,
  //       data: {
  //         images: selectedImages,
  //         title,
  //         description,
  //         budget: parseFloat(budget),
  //       },
  //     };
  
  //     const response = await fetch(`http://${iPAdress}:6000/api/users/save-list-my-space`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });
  
  //     if (response.ok) {
  //       Alert.alert('Success', 'Details saved successfully');
  //     } else {
  //       const responseData = await response.json();
  //       Alert.alert('Error', responseData.message || 'Failed to save details.');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     Alert.alert('Error', 'Failed to save details: ' + error.message);
  //   }

  // };

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

      // After all images are uploaded, you can now save the data along with image URLs
      const data = {
        userId,
        data: {
          images: firebaseImageURLs, // Replace with Firebase image URLs
          title,
          description,
          budget: parseFloat(budget),
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

  // const pushImagesToFirebase = async () => {
  //   for (const uri of selectedImages) {
  //     const fileName = uri.split('/').pop();
  //     const uploadResponse = await uploadToFirebase(uri, fileName, userId);
  //     // Handle the upload response as needed
  //   }
  //   Alert.alert('Success', 'All pictures uploaded successfully');
  // };

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
      <Button title="Submit" onPress={handleUpload} />
    </View>
  );
};

export default ListMySpace;
