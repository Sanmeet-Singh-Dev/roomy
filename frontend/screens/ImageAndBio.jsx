import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation , useRoute} from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';
import { uploadToFirebase } from '../firebase-config';
import { UserType } from '../UserContext';
import { manipulateAsync } from 'expo-image-manipulator';
import { IPADDRESS } from '@env';


const ImageAndBio = () => {

  const [work, setWork] = useState('');
  const [bio, setBio] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  // const [selectedImageUri, setSelectedImageUri] = useState(null);
  const route = useRoute();
  const userId = route.params?.userId;
  const currentStep = 2;
  const steps = 6;

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

        const compressedImage = await manipulateAsync(
          uri,
          [{ resize: { width: 800, height: 800 } }],
          { format: 'jpeg', compress: 0.6 }
        );

        setSelectedImages([...selectedImages, compressedImage.uri]);

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

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  const handleBack = () => {
    navigation.goBack();
  }


  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
    <View style={styles.container}>
      <SafeAreaView>
      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
          source={require('../assets/back.png')}
          style={styles.sortIcon}
        />
        <Text style={styles.sortText}>Image and Bio</Text>
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

        <Text style={styles.label}>Add your Images</Text>

        <ScrollView horizontal contentContainerStyle={styles.scrollViewContent}>
          {selectedImages.map((uri, index) => (
            <Image 
              key={index}
              source={{ uri }}
              style={{ width: 100, height: 100, marginLeft: 20, marginTop: 10, marginBottom: 10, }}
            />
          ))}
        </ScrollView>

        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.currentButton} onPress={handleImageSelection}>
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>
        </View>
      
        <Text style={styles.label}>What do you currently do?</Text>

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

        <Text style={styles.label}>Add a Bio</Text>
        <TextInput
          placeholder="Add a Bio:"
          value={bio}
          onChangeText={setBio}
          multiline={true}
          // numberOfLines={4}
          style={styles.textArea}
        />

        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
    </TouchableWithoutFeedback>
  )
}

export default ImageAndBio


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
    marginTop: 40,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10
  },
  btnContainer : {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF8F66',
    color: '#fff',
    marginTop: 30,
    paddingHorizontal: 70,
    paddingVertical: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold'
  },
  currentButton: {
    backgroundColor: '#51367B',
    color: '#fff',
    marginTop: 30,
    paddingHorizontal: 70,
    paddingVertical: 18,
    borderRadius: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5
  },
  selectedOption: {
    backgroundColor: '#FF8F66', 
    color: 'white'
  },
  optionText: {
    color: 'black', // Change to your desired text color
    textAlign: 'center',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 8,
    textAlignVertical: 'top',
    height: 80,
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
    fontSize: 17,
    fontWeight: "500",
  },
});