import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { IPADDRESS } from "@env"
import DateTimePicker from '@react-native-community/datetimepicker';

const Details = () => {
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || dateOfBirth; // Use the selected date or the current value of dateOfBirth
      setShow(Platform.OS === 'ios');
    
      const formattedDate = currentDate.toLocaleDateString(); // Format the selected date
    
      setDateOfBirth(formattedDate); // Set the formatted date in your state
    
    };
  
    const showDatepicker = () => {
      setShow(false);
    };

    let ipAdress = IPADDRESS;
    console.log(dateOfBirth.valueOf());

    const navigation = useNavigation();

    const handleGenderSelection = (gender) => {
      setGender(gender);
    };
  
    const handleSaveProfile = async () => {
      console.log('handleSaveProfile run');
        try {
          // Get the authentication token from AsyncStorage
          console.log('in try');
          const token = await AsyncStorage.getItem('jwt');
          console.log(token);
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
              fullName,
              gender,
              dateOfBirth,
            }),
          });
      
          if (response.ok) {
            // Handle a successful response
            const data = await response.json();
            navigation.navigate('location');
          } else {
            // Handle an unsuccessful response (e.g., show an error message)
            console.error('Error updating profile.');
            console.log("here 2")
          }
        } catch (error) {
          // Handle fetch or AsyncStorage errors
          console.error('Error:', error);
          console.log("here 3")
        }
    };
  
    return (
      <View style={styles.container}>
        <SafeAreaView>
        <Text>Profile Details</Text>
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text>Gender:</Text>

        <View style={styles.optionsContainer}>

          <TouchableOpacity
            style={[
              styles.option,
              gender === 'Male' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Male')}
          >
            <Text style={styles.optionText}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              gender === 'Female' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Female')}
          >
            <Text style={styles.optionText}>Female</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              gender === 'Other' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelection('Other')}
          >
            <Text style={styles.optionText}>Other</Text>
          </TouchableOpacity>

      </View>

        {/* <TextInput
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        /> */}

        <Button onPress={showDatepicker} title="Show Date Spinner" />

        <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode="date" // Set to 'spinner' for spinner interface
        // is24Hour={true}
        display="default" // Set to 'spinner' to show spinner by default
        onChange={onChange}
        />
        
        <Button title="Save Profile" onPress={handleSaveProfile} />

        </SafeAreaView>
      </View>
    );
};
  

export default Details

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
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