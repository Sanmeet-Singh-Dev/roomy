import React, { useEffect, useState } from 'react'
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { listFiles, uploadToFirebase } from '../firebase-config';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';



export const Camera = ({ userId , uploadResponse }) => {
    const [permission, requestPermission] = ImagePicker.useCameraPermissions();
    const [files, setFiles] = useState([])
    const [selectedImages, setSelectedImages] = useState([]);
  
    useEffect(()=>{
      listFiles().then((listResponse)=>{
  
        const files = listResponse.map((value) => {
          return { name : value.fullPath }
        })
        setFiles(files)
        // console.log('Files in Firebase:', files);
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
  
        console.log(cameraResp)
  
        if (!cameraResp.canceled) {
          const { uri } = cameraResp.assets[0];
          const fileName = uri.split('/').pop();
          setSelectedImages([...selectedImages, uri]);
          // const uploadResponse = await uploadToFirebase(uri, fileName, userId);
          // Alert.alert('Success Picture uploaded successfully');
        }
      } catch (error) {
        console.error('ImagePicker Error:', error);
        Alert.alert('Error', `Failed to pick an image from the library: ${error.message}`);
      }
  
        // if (!cameraResp.canceled) {
        //   const { uri } = cameraResp.assets[0];
        //   const fileName = uri.split('/').pop();
        //   // const uploadResponse = await uploadToFirebase(uri, fileName , userId);
        //   // console.log(uploadResponse);
        //   listFiles().then((listResponse)=>{
  
        //     const files = listResponse.map((value) => {
        //       return { name : value.fullPath }
        //     })
        //     setFiles(files)
        //   });
        // }
      // } catch (e) {
      //   Alert.alert("Error Uploading Image " + e.message)
      // }
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
    <View>
    <StatusBar style="auto" />
    <Button title="Take Picture" onPress={takePhoto}></Button>
  </View>
  )
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
