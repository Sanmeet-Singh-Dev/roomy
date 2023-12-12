import {  useFonts, 
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation , useRoute} from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';
import { uploadToFirebase } from '../firebase-config';
import { StatusBar } from 'expo-status-bar';
import { UserType } from '../UserContext';
import { manipulateAsync } from 'expo-image-manipulator';
import { IPADDRESS } from '@env';
import NextButton from '../components/NextButton';

const ImageAndBio = () => {

  const [work, setWork] = useState('');
  const [bio, setBio] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  // const [selectedImageUri, setSelectedImageUri] = useState(null);
  const route = useRoute();
  const userId = route.params?.userId;
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
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

  let [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
});

if (!fontsLoaded) {
    return null;
}

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
      const response = await fetch(`https://roomyapp.ca/api/api/users/bio`, {
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
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      extraScrollHeight={Platform.OS === 'ios' ? 50 : 0} // Adjust this value based on your UI
      enableOnAndroid={true}
    >
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

        <ScrollView horizontal contentContainerStyle={styles.scrollViewContent}>
          {selectedImages.map((uri, index) => (
            <Image 
              key={index}
              source={{ uri }}
              style={{ width: 100, height: 100, marginLeft: 20, marginTop: 10, marginBottom: 10, }}
            />
          ))}
        </ScrollView>
      
        <Text style={styles.label}>What do you currently do?</Text>

        <View style={styles.optionsContainer}>

          <TouchableOpacity
            style={[
              styles.option,
              work === 'Working Professional' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Working Professional')}
          >
            <Text style={[styles.optionText, work === 'Working Professional' && styles.selectedOptionText]}>Working Professional</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              work === 'Unemployed' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Unemployed')}
          >
            <Text style={[styles.optionText, work === 'Unemployed' && styles.selectedOptionText]}>Unemployed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              work === 'Student' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Student')}
          >
            <Text style={[styles.optionText, , work === 'Student' && styles.selectedOptionText]}>Student</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              work === 'Business' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Business')}
          >
            <Text style={[styles.optionText, work === 'Business' && styles.selectedOptionText]}>Business</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              work === 'Other' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Other')}
          >
            <Text style={[styles.optionText, work === 'Other' && styles.selectedOptionText]}>Other</Text>
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
            <Image
            source={require('../assets/Horizontal.png')}
            style={styles.nextIcon}
            />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  )
}

export default ImageAndBio


const styles = StyleSheet.create({
  pictureImage: {
    width: 34,
    height: 28.8,
    resizeMode: 'cover',
  },
  pictureText: {
    marginTop: 8,
    fontSize: 8,
    fontFamily: 'Outfit_600SemiBold',
    color:'#9B9B9B',
    fontSize: 12,
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
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    fontFamily: 'Outfit_600SemiBold',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10
  },
  btnContainer : {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "34%",
},
button: {
    backgroundColor: '#51367B',
    color: '#fff',
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
    backgroundColor: 'lightgray',
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  selectedOption: {
    backgroundColor: '#FF8F66', 
    color: 'white'
  },
  selectedOptionText: {
    color: '#fff',
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
  },
  optionText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 0,
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
    fontSize: 18,
    fontFamily: 'Outfit_500Medium',
  },
});