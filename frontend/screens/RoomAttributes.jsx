import {  useFonts, 
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '@env'
import { useNavigation } from '@react-navigation/native'
const currentStep = 2;
const steps = 3;

const RoomAttributes = () => {
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [numBedrooms, setNumBedrooms] = useState('');
    const [numBathrooms, setNumBathrooms] = useState('');

    const navigation = useNavigation();

    const availableAttributes = [
        'parking', 'laundry', 'balcony', 'hydro',
        'air-con', 'basement', 'bike-parking',
        'oven', 'concierge', 'dishwasher', 'fireplace',
        'fitness-center', 'patio', 'microwave',
        'tv', 'garbage-disposal', 'refrigerator', 'wheelchair-accessible',
        'roof-deck', 'storage', 'walkin-closet'
    ];

    let [fontsLoaded] = useFonts({
      Outfit_400Regular,
      Outfit_500Medium,
      Outfit_600SemiBold,
      Outfit_700Bold,
  });
  
  if (!fontsLoaded) {
      return null;
  }

    const toggleAttributes = (attribute) => {
        if (selectedAttributes.includes(attribute)) {
            // If the interest is already selected, remove it
            setSelectedAttributes((prevAttribute) =>
                prevAttribute.filter((item) => item !== attribute)
            );
        } else {
            // If the interest is not selected, add it
            setSelectedAttributes((prevAttribute) => [...prevAttribute, attribute]);
        }
    };

    const handleSaveAttributes = async () => {
        let ipAddress = IPADDRESS;
      
        try {
          // Get the authentication token from AsyncStorage
          const token = await AsyncStorage.getItem('jwt');
      
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }

          console.log(parseInt(numBedrooms), parseInt(numBathrooms))
      
          const response = await fetch(`https://roomyapp.ca/api/api/users/update-room-attributes`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the token as a bearer token
            },
            body: JSON.stringify({
              attributes: selectedAttributes, // Pass the selected attributes array
              numBedrooms: parseInt(numBedrooms),
              numBathrooms: parseInt(numBathrooms), 
            }),
          });
      
          if (response.ok) {
            // Handle a successful response
            const data = await response.json();
            navigation.navigate('spaces');
          } else {
            // Handle an unsuccessful response (e.g., show an error message)
            console.error('Error updating room attributes.');
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
      <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
          source={require('../assets/back.png')}
          style={styles.sortIcon}
        />
        <Text style={styles.sortText}>About the Space</Text>
      </TouchableOpacity>

      <View style={styles.containerMain}>
        <View style={styles.progressBar}>
          {[...Array(steps).keys()].map((step) => (
          <View key={step} style={styles.stepContainer}>
            <View
              style={[
                styles.dot,
                { backgroundColor: step <= currentStep ? '#FF8F66' : 'lightgray' },
              ]}
            />
              {step < steps - 1 && <View style={styles.line} />}
            </View>
        ))}
      </View>
            <ScrollView>


                <Text style={styles.text}>Number of Bedrooms</Text>
                <TextInput
                    keyboardType="numeric"
                    placeholder="Enter number of bedrooms"
                    value={numBedrooms}
                    onChangeText={setNumBedrooms}
                    style={styles.textInput}
                />

                <Text style={styles.text}>Number of Bathrooms</Text>
                <TextInput
                    keyboardType="numeric"
                    placeholder="Enter number of bathrooms"
                    value={numBathrooms}
                    onChangeText={setNumBathrooms}
                    style={styles.textInput}
                />

                   
            <View>
             <Text style={styles.text}>Room Attributes</Text>
                <View style={styles.container}>
                    {availableAttributes.map((attributes) => (
                        <TouchableOpacity
                            key={attributes}
                            style={[
                                styles.option,
                                selectedAttributes.includes(attributes) && styles.selectedOption,
                            ]}
                            onPress={() => toggleAttributes(attributes)}
                        >
                            <Text style={[styles.optionText, { color: selectedAttributes.includes(attributes) ? 'white' : 'black' }, ]}>{attributes}</Text>
                        </TouchableOpacity>
                    ))}

                </View>
             </View>       
                <TouchableOpacity style={styles.button} onPress={handleSaveAttributes}>
          <Text style={styles.buttonText}>Submit {'>'}</Text>
        </TouchableOpacity>

            </ScrollView>

        </View>
        </View>
    )
}

export default RoomAttributes

const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
        padding: 30,
        paddingBottom: "5%",
        backgroundColor:"#fff"
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap:10
    },
    option: {
        padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#EEEEEE',
    },
    selectedOption: {
        backgroundColor: '#FF8F66',
        color: '#fff',
    },
    optionText: {
        color: 'black',
        textAlign: 'center',
        fontFamily: 'Outfit_400Regular',
        fontSize: 14
    },
    text: {
        fontSize: 16,
        marginTop: 30,
        fontWeight:'500',
        marginBottom:10,
        fontFamily: 'Outfit_500Medium'
    },
    button: {
        backgroundColor: '#51367B',
        color: '#fff',
        margin: 10,
        padding: 20,
        borderRadius: 8,
        width: '55%',
        alignSelf: 'center',
        marginTop:30,
        marginBottom: "20%"
      },
      buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '500',
        fontFamily: 'Outfit_500Medium'
      },
      textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        padding: 10,
        fontFamily: 'Outfit_400Regular',
        fontSize: 16
      },
      progressBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 40,
        width: '52%',
      },
      stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      dot: {
        width: 15,
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
      backIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: "15%",
        marginLeft: "2%",
        marginBottom: "1%",
      },
      sortText: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
      },
      sortIcon: {
        width: 30,
        height: 30,
        margin: 5,
      },
      mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: "0%",
      },
});
