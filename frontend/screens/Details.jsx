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
    const [budget, setBudget] = useState('');
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
              fullName,
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
  
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Text  style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={styles.textInput}
          />

          <Text style={styles.label}>Gender:</Text>

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

          <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date" // Set to 'spinner' for spinner interface
          // is24Hour={true}
          display="default" 
          style={styles.dateTimePicker}
          onChange={onChange}
          />

          <TextInput
            keyboardType="numeric"
            placeholder="Budget"
            onChangeText={setBudget}
            value={budget}
            style={styles.textInput}
          />
          
          <TouchableOpacity style={styles.button}>  
          <Text style={styles.buttonText} onPress={handleSaveProfile}>Save Profile</Text>
          </TouchableOpacity>

        </SafeAreaView>
        
      </View>

    );
};
  

export default Details

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: 'white'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: 'blue', // Change to your desired highlight color
    borderColor: 'blue',
    color:'#fff' // Change to your desired highlight color
  },
  optionText: {
    color: 'black', // Change to your desired text color
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#007AFF',
    color: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 8,
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
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  dateTimePicker: {
    // backgroundColor: '#fff',
    borderColor: 'gray',
    // borderWidth: 1, 
    // borderRadius: 8, 
    paddingHorizontal: 10,
    marginBottom: 16, 
    alignSelf: 'center',
    
  },
});