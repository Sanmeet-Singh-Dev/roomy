import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { IPADDRESS } from "@env"
import DateTimePicker from '@react-native-community/datetimepicker';
import NextButton from '../components/NextButton';
import {  useFonts, 
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';

const Details = () => {
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [budget, setBudget] = useState('');
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const currentStep = 0;
    const steps = 6;

    let [fontsLoaded] = useFonts({
      Outfit_400Regular,
      Outfit_500Medium,
      Outfit_600SemiBold,
      Outfit_700Bold,
  });

  if (!fontsLoaded) {
      return null;
  }

    const onChange = (event, selectedDate) => {
      setShow(Platform.OS === 'ios');

      const formattedDate = selectedDate.toLocaleDateString(); // Format the selected date

      if (event.type === 'set' && selectedDate) {
        setDateOfBirth(formattedDate);
      }
    };
  
    const showDatepicker = () => {
      setShow(false);
    };

    let ipAdress = IPADDRESS;

    const navigation = useNavigation();

    const handleGenderSelection = (gender) => {
      setGender(gender);
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
          
          const response = await fetch(`http://${ipAdress}:6000/api/users/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the token as a bearer token
            },
            body: JSON.stringify({
              gender,
              dateOfBirth,
              budget,
            }),
          });
      
          if (response.ok) {
            // Handle a successful response
            const data = await response.json();
            const userId = data._id;
            navigation.navigate('location' , {userId: userId} );
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
      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
            <Image
              source={require('../assets/back.png')}
              style={styles.sortIcon}
            />
            <Text style={styles.sortText}>Get your profile started</Text>
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

        <SafeAreaView>

          <Text style={styles.label}>Gender</Text>

          <View style={styles.optionsContainer}>

            <TouchableOpacity
              style={[
                styles.option,
                gender === 'Male' && styles.selectedOption,
              ]}
              onPress={() => handleGenderSelection('Male')}
            >
              <Text style={[styles.optionText, gender === 'Male' && styles.selectedOptionText]}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                gender === 'Female' && styles.selectedOption,
              ]}
              onPress={() => handleGenderSelection('Female')}
            >
              <Text style={[styles.optionText, gender === 'Female' && styles.selectedOptionText]}>Female</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                gender === 'Other' && styles.selectedOption,
              ]}
              onPress={() => handleGenderSelection('Other')}
            >
              <Text style={[styles.optionText, gender === 'Other' && styles.selectedOptionText]}>Other</Text>
            </TouchableOpacity>

          </View>

          <Text style={styles.label}>Date of Birth</Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date" // Set to 'spinner' for spinner interface
            // is24Hour={true}
            display="default" 
            style={styles.dateTimePicker}
            onChange={onChange}
          />

          <Text style={styles.label}>Budget</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Budget"
            onChangeText={setBudget}
            value={budget}
            style={styles.textInput}
          />
          
          {/* <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View> */}

          <NextButton onPress={handleSaveProfile} buttonText="Next" />


        </SafeAreaView>
        
      </View>
      </TouchableWithoutFeedback>
    );
};
  

export default Details

const styles = StyleSheet.create({
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
  optionsContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    gap: 30,
    marginTop: 10,
    marginBottom: 10
  },
  option: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#FF8F66',
    color:'#fff'
  },
  optionText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Outfit_400Regular',
  },
  selectedOptionText: {
    color: '#fff',
    fontFamily: 'Outfit_400Regular',
  },
  btnContainer : {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#51367B',
    color: '#fff',
    marginTop: 30,
    paddingHorizontal: 70,
    paddingVertical: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
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
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    fontFamily: 'Outfit_400Regular',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10
  },
  dateTimePicker: {
    borderColor: 'lightgray',
    marginTop: 10,
    marginBottom: 16, 
    marginLeft: 7.5,
    alignSelf: 'start',
  },
  backIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: "15%",
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
    fontFamily: 'Outfit_600SemiBold',
  },
});