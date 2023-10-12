import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginOptions from './screens/LoginOptions';
import Login from './screens/Login';
import Register from './screens/Register';
import * as ImagePicker from 'expo-image-picker';
import { uploadToFirebase , listFiles } from './firebase-config';

const stack = createNativeStackNavigator();

export default function App() {

  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [files, setFiles] = useState([])

  useEffect(()=>{
    listFiles().then((listResponse)=>{

      const files = listResponse.map((value) => {
        return { name : value.fullPath }
      })
      setFiles(files)
    });
  }, [])

  console.log(files)

  /**
   * 
   */


  const takePhoto = async () => {
    try {
      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1

      });

      if (!cameraResp.canceled) {
        const { uri } = cameraResp.assets[0];
        const fileName = uri.split('/').pop();
        const uploadResponse = await uploadToFirebase(uri, fileName);
        console.log(uploadResponse);

        listFiles().then((listResponse)=>{

          const files = listResponse.map((value) => {
            return { name : value.fullPath }
          })
          setFiles(files)
        });
      }
    } catch (e) {
      Alert.alert("Error Uploading Image " + e.message)
    }
  };



  //permission check
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
    <NavigationContainer>

      <stack.Navigator initialRouteName='loginOptions'>

        <stack.Screen name="loginOptions" component={LoginOptions} options={{ headerShown: false }} />
        <stack.Screen name='login' component={Login} options={{ headerShown: false }} />
        <stack.Screen name='register' component={Register} options={{ headerShown: false }} />


      </stack.Navigator>

      <View style={styles.container}>
        <Text>Camera Component</Text>
        <StatusBar style="auto" />
        <Button title="Take Picture" onPress={takePhoto}></Button>
      </View>

    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'skyblue',
    paddingVertical: 25,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fffc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});