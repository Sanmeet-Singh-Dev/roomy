import {  useFonts, 
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Image } from 'react-native'
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

    let [fontsLoaded] = useFonts({
      Outfit_400Regular,
      Outfit_500Medium,
      Outfit_600SemiBold,
      Outfit_700Bold,
  });

  if (!fontsLoaded) {
      return null;
  }

    const navigation = useNavigation();
    const currentStep = 3;
    const steps = 6;

    const handleSaveHabits = async () => {
        let ipAdress = IPADDRESS;
     
          try {
            // Get the authentication token from AsyncStorage
        
            const token = await AsyncStorage.getItem('jwt');

            if (!token) {
              // Handle the case where the token is not available
              console.error('No authentication token available.');
              return;
            }
        
            const response = await fetch(`http://roomyapp.ca/api/api/users/habits`, {
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
        
            }
          } catch (error) {
            // Handle fetch or AsyncStorage errors
            console.error('Error:', error);
       
          }
      };
      const handleBack = () => {
        navigation.goBack();
      }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
          source={require('../assets/back.png')}
          style={styles.sortIcon}
        />
        <Text style={styles.sortText}>Your Personal and Living Habits</Text>
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

        <Text style={{ marginLeft: 20 , marginBottom: 5, fontSize: 16, fontFamily: 'Outfit_600SemiBold',}}>Smoking</Text>
        <View style={{ display:'flex' , flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginLeft: 20, marginRight: 20}}>
        <TouchableOpacity
            style={[
            styles.option,
            smoking === 'Daily' && styles.selectedOption,
            ]}
            onPress={() => setSmoking('Daily')}
        >
            <Text style={[styles.optionText, smoking === 'Daily' && styles.selectedOptionText]}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            smoking === 'Occasional' && styles.selectedOption,
            ]}
            onPress={() => setSmoking('Occasional')}
        >
            <Text style={[styles.optionText, smoking === 'Occasional' && styles.selectedOptionText]}>Occasional</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            smoking === 'Never' && styles.selectedOption,
            ]}
            onPress={() => setSmoking('Never')}
        >
            <Text style={[styles.optionText, smoking === 'Never' && styles.selectedOptionText]}>Never</Text>
        </TouchableOpacity>
        </View>

        <Text style={{ marginLeft: 20, marginBottom: 5, marginTop: 30, fontSize: 16, fontFamily: 'Outfit_600SemiBold', }}>Guests</Text>
        <View style={{ display:'flex' , flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginLeft: 20, marginRight: 20}}>
        <TouchableOpacity
            style={[
            styles.option,
            guests === 'Daily' && styles.selectedOption,
            ]}
            onPress={() => setGuests('Daily')}
        >
            <Text style={[styles.optionText, guests === 'Daily' && styles.selectedOptionText]}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            guests === 'Occasional' && styles.selectedOption,
            ]}
            onPress={() => setGuests('Occasional')}
        >
            <Text style={[styles.optionText, guests === 'Occasional' && styles.selectedOptionText]}>Occasional</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            guests === 'Never' && styles.selectedOption,
            ]}
            onPress={() => setGuests('Never')}
        >
            <Text style={[styles.optionText, guests === 'Never' && styles.selectedOptionText]}>Never</Text>
        </TouchableOpacity>
        </View>

        <Text style={{ marginLeft: 20, marginBottom: 5, marginTop: 30, fontSize: 16, fontFamily: 'Outfit_600SemiBold', }}>Drinking</Text>
        <View style={{ display:'flex' , flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginLeft: 20, marginRight: 20}}>
        <TouchableOpacity
            style={[
            styles.option,
            drinking === 'Daily' && styles.selectedOption,
            ]}
            onPress={() => setDrinking('Daily')}
        >
            <Text style={[styles.optionText, drinking === 'Daily' && styles.selectedOptionText]}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            drinking === 'Occasional' && styles.selectedOption,
            ]}
            onPress={() => setDrinking('Occasional')}
        >
            <Text style={[styles.optionText, drinking === 'Occasional' && styles.selectedOptionText]}>Occasional</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            drinking === 'Never' && styles.selectedOption,
            ]}
            onPress={() => setDrinking('Never')}
        >
            <Text style={[styles.optionText, drinking === 'Never' && styles.selectedOptionText]}>Never</Text>
        </TouchableOpacity>
        </View>

        <Text style={{ marginLeft: 20, marginBottom: 5, marginTop: 30, fontSize: 16, fontFamily: 'Outfit_600SemiBold', }}>Pets</Text>
        <View style={{ display:'flex' , flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginLeft: 20, marginRight: 20}}>
        <TouchableOpacity
            style={[
            styles.option,
            pets === 'Have' && styles.selectedOption,
            ]}
            onPress={() => setPets('Have')}
        >
            <Text style={[styles.optionText, pets === 'Have' && styles.selectedOptionText]}>Have</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            pets === 'Dont Have' && styles.selectedOption,
            ]}
            onPress={() => setPets('Dont Have')}
        >
            <Text style={[styles.optionText, pets === 'Dont Have' && styles.selectedOptionText]}>Dont Have</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            pets === 'May Have' && styles.selectedOption,
            ]}
            onPress={() => setPets('May Have')}
        >
            <Text style={[styles.optionText, pets === 'May Have' && styles.selectedOptionText]}>May Have</Text>
        </TouchableOpacity>
        </View>

        <Text style={{ marginLeft: 20, marginBottom: 5, marginTop: 30, fontSize: 16, fontFamily: 'Outfit_600SemiBold', }}>Food Choice</Text>
        <View style={{ display:'flex' , flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginLeft: 20, marginRight: 20}}>
        <TouchableOpacity
            style={[
            styles.option,
            food === 'Vegan' && styles.selectedOption,
            ]}
            onPress={() => setFood('Vegan')}
        >
            <Text style={[styles.optionText, food === 'Vegan' && styles.selectedOptionText]}>Vegan</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            food === 'Vegetarian' && styles.selectedOption,
            ]}
            onPress={() => setFood('Vegetarian')}
        >
            <Text style={[styles.optionText, food === 'Vegetarian' && styles.selectedOptionText]}>Vegetarian</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.option,
            food === 'Non-Vegetarian' && styles.selectedOption,
            ]}
            onPress={() => setFood('Non-Vegetarian')}
        >
            <Text style={[styles.optionText, food === 'Non-Vegetarian' && styles.selectedOptionText]}>Non-Vegetarian</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSaveHabits}>
            <Text style={styles.buttonText}>Next</Text>
            <Image
            source={require('../assets/Horizontal.png')}
            style={styles.nextIcon}
            />
          </TouchableOpacity>
        </View>

        </ScrollView>
        </SafeAreaView>
    </View>
  )
}

export default Livinghabits

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
    marginTop: 50,
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
    btnContainer : {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "13%",
  },
  button: {
      backgroundColor: '#51367B',
      color: '#fff',
      marginTop: 30,
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
    option: {
      backgroundColor: 'lightgray',
      paddingHorizontal: 19,
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