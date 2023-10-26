import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '@env'
import { useNavigation } from '@react-navigation/native'

const Livinghabits = () => {

    const [smoking, setSmoking] = useState('');
    const [guests, setGuests] = useState(''); 
    const [drinking, setDrinking] = useState(''); 
    const [pets, setPets] = useState('');
    const [food, setFood] = useState('');

    const navigation = useNavigation();

    const handleSaveHabits = async () => {
        let ipAdress = IPADDRESS;
        console.log('handleSaveHabits run');
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
        
            const response = await fetch(`http://${ipAdress}:6000/api/users/habits`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token as a bearer token
              },
              body: JSON.stringify({
                smoking,
                guests,
                drinking,
                pets,
                food
              }),
            });
        
            if (response.ok) {
              // Handle a successful response
              const data = await response.json();
              navigation.navigate('interests');
            } else {
              // Handle an unsuccessful response (e.g., show an error message)
              console.error('Error updating profile.');
              console.log("here 2");
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
        <ScrollView>
        <Text>Personal and Living Habits</Text>

        <Text>Smoking</Text>
        <TouchableOpacity
            style={[
            styles.option,
            smoking === 'Daily' && styles.selectedOption,
            ]}
            onPress={() => setSmoking('Daily')}
        >
            <Text style={styles.optionText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            smoking === 'Occasional' && styles.selectedOption,
            ]}
            onPress={() => setSmoking('Occasional')}
        >
            <Text style={styles.optionText}>Occasional</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            smoking === 'Never' && styles.selectedOption,
            ]}
            onPress={() => setSmoking('Never')}
        >
            <Text style={styles.optionText}>Never</Text>
        </TouchableOpacity>

        <Text>Guests</Text>
        <TouchableOpacity
            style={[
            styles.option,
            guests === 'Daily' && styles.selectedOption,
            ]}
            onPress={() => setGuests('Daily')}
        >
            <Text style={styles.optionText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            guests === 'Occasional' && styles.selectedOption,
            ]}
            onPress={() => setGuests('Occasional')}
        >
            <Text style={styles.optionText}>Occasional</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            guests === 'Never' && styles.selectedOption,
            ]}
            onPress={() => setGuests('Never')}
        >
            <Text style={styles.optionText}>Never</Text>
        </TouchableOpacity>

        <Text>Drinking</Text>
        <TouchableOpacity
            style={[
            styles.option,
            drinking === 'Daily' && styles.selectedOption,
            ]}
            onPress={() => setDrinking('Daily')}
        >
            <Text style={styles.optionText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            drinking === 'Occasional' && styles.selectedOption,
            ]}
            onPress={() => setDrinking('Occasional')}
        >
            <Text style={styles.optionText}>Occasional</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            drinking === 'Never' && styles.selectedOption,
            ]}
            onPress={() => setDrinking('Never')}
        >
            <Text style={styles.optionText}>Never</Text>
        </TouchableOpacity>

        <Text>Pets</Text>
        <TouchableOpacity
            style={[
            styles.option,
            pets === 'Have' && styles.selectedOption,
            ]}
            onPress={() => setPets('Have')}
        >
            <Text style={styles.optionText}>Have</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            pets === 'Dont Have' && styles.selectedOption,
            ]}
            onPress={() => setPets('Dont Have')}
        >
            <Text style={styles.optionText}>Dont Have</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            pets === 'May Have' && styles.selectedOption,
            ]}
            onPress={() => setPets('May Have')}
        >
            <Text style={styles.optionText}>May Have</Text>
        </TouchableOpacity>

        <Text>Food Choice</Text>
        <TouchableOpacity
            style={[
            styles.option,
            food === 'Vegan' && styles.selectedOption,
            ]}
            onPress={() => setFood('Vegan')}
        >
            <Text style={styles.optionText}>Vegan</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            food === 'Vegetarian' && styles.selectedOption,
            ]}
            onPress={() => setFood('Vegetarian')}
        >
            <Text style={styles.optionText}>Vegetarian</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            food === 'Non-Vegetarian' && styles.selectedOption,
            ]}
            onPress={() => setFood('Non-Vegetarian')}
        >
            <Text style={styles.optionText}>Non-Vegetarian</Text>
        </TouchableOpacity>

        

        <Button title="Save Habits" onPress={handleSaveHabits} />
        </ScrollView>
        </SafeAreaView>
    </View>
  )
}

export default Livinghabits

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
    },
    option: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginVertical: 5,
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