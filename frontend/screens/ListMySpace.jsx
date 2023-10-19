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

const ListMySpace = ({ onUpload, onTakePhoto }) => {
  const route = useRoute();
  const userName = route.params?.userName;
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("jwt");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUsers();
  }, []);

  const handleUpload = () => {
    if (!title || !description || !budget) {
      Alert.alert('Please Check Input', 'Please enter all the details');
      return;
    }
    onUpload({ title, description, budget });
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

  const pushImagesToFirebase = async () => {
    for (const uri of selectedImages) {
      const fileName = uri.split('/').pop();
      const uploadResponse = await uploadToFirebase(uri, fileName, userId);
      // Handle the upload response as needed
    }
    Alert.alert('Success', 'All pictures uploaded successfully');
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
      <Button title="Submit" onPress={handleUpload} />
      <Button title="Push to Firebase" onPress={pushImagesToFirebase} />
    </View>
  );
};

export default ListMySpace;
