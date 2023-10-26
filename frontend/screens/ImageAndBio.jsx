import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation , useRoute} from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';
import { uploadToFirebase } from '../firebase-config';
import { UserType } from '../UserContext';
import { IPADDRESS } from '@env';


const ImageAndBio = () => {

  const [work, setWork] = useState('');
  const [bio, setBio] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  // const [selectedImageUri, setSelectedImageUri] = useState(null);
  const route = useRoute();
  const userId = route.params?.userId;

  const navigation = useNavigation();

  const handleGenderSelection = (work) => {
    setWork(work);
  };
  let ipAdress = IPADDRESS;
  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      getPermissions()
    }
  }, []);

  const handleImageSelection = async () => {

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        const fileName = uri.split('/').pop();
        setSelectedImages([...selectedImages, uri]);

      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
      Alert.alert('Error', `Failed to pick an image from the library: ${error.message}`);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Get the authentication token from AsyncStorage
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        // Handle the case where the token is not available
        console.error('No authentication token available.');
        return;
      }

      // Array to store Firebase image URLs
      const firebaseImageURLs = [];

      // Function to upload a single image to Firebase and collect the URL
      const uploadImageToFirebase = async (uri) => {
        const fileName = uri.split('/').pop();
        const uploadResponse = await uploadToFirebase(uri, fileName, userId);
        if (uploadResponse) {
          firebaseImageURLs.push(uploadResponse.downloadUrl);
          console.log(firebaseImageURLs)
        }

      };

      // Upload all selected images to Firebase concurrently
      await Promise.all(selectedImages.map(uploadImageToFirebase));


      const data = {
        data: {
          profilePhoto: firebaseImageURLs,
          image: firebaseImageURLs[0],
          work,
          bio,
        },
        
      };
      const response = await fetch(`http://${ipAdress}:6000/api/users/bio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token as a bearer token
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Handle a successful response
        const data = await response.json();
        navigation.navigate('livinghabits');
      } else {
        // Handle an unsuccessful response (e.g., show an error message)
        console.error('Error updating profile.');
      }
    } catch (error) {
      // Handle fetch or AsyncStorage errors
      console.error('Error:', error);
    }
  };




  return (
    <View>
      <SafeAreaView>

        <Text>Image Component here.</Text>

        <Text>What do you currently do?</Text>

        <View style={styles.optionsContainer}>

          <TouchableOpacity
            style={[
              styles.option,
              work === 'Working Professional' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Working Professional')}
          >
            <Text style={styles.optionText}>Working Professional</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              work === 'Unemployed' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Unemployed')}
          >
            <Text style={styles.optionText}>Unemployed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              work === 'Student' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Student')}
          >
            <Text style={styles.optionText}>Student</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              work === 'Business' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Business')}
          >
            <Text style={styles.optionText}>Business</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              work === 'Other' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Other')}
          >
            <Text style={styles.optionText}>Other</Text>
          </TouchableOpacity>

        </View>

        <TextInput
          placeholder="Add a Bio:"
          value={bio}
          onChangeText={setBio}
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

        <Button title="Select Image" onPress={handleImageSelection} />

        <Button title="Next" onPress={handleSaveProfile} />

      </SafeAreaView>
    </View>
  )
}

export default ImageAndBio


const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: 'blue', // Change to your desired highlight color
    borderColor: 'blue', // Change to your desired highlight color
  },
  optionText: {
    color: 'black', // Change to your desired text color
    textAlign: 'center',
  },
});