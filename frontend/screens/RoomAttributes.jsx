import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '@env'
import { useNavigation } from '@react-navigation/native'

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
      
          const response = await fetch(`http://${ipAddress}:6000/api/users/update-room-attributes`, {
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
            navigation.navigate('Spaces');
          } else {
            // Handle an unsuccessful response (e.g., show an error message)
            console.error('Error updating room attributes.');
          }
        } catch (error) {
          // Handle fetch or AsyncStorage errors
          console.error('Error:', error);
        }
      };
      


    return (
        <View style={styles.containerMain}>
            <ScrollView>
                <Text style={styles.text}>About the Space</Text>


                <Text style={styles.text}>Number of Bedrooms</Text>
                <TextInput
                    placeholder="Enter number of bedrooms"
                    value={numBedrooms}
                    onChangeText={setNumBedrooms}
                    style={styles.textInput}
                />

                <Text style={styles.text}>Number of Bathrooms</Text>
                <TextInput
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
                            <Text style={styles.optionText}>{attributes}</Text>
                        </TouchableOpacity>
                    ))}

                </View>
             </View>       
                <TouchableOpacity style={styles.button} onPress={handleSaveAttributes}>
          <Text style={styles.buttonText}>Submit {'>'}</Text>
        </TouchableOpacity>

            </ScrollView>

        </View>
    )
}

export default RoomAttributes

const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
        padding: 30,
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
    backgroundColor: '#EEEEEE'
    },
    selectedOption: {
        backgroundColor: '#FF8F66',
        color: '#fff',
    },
    optionText: {
        color: 'black',
        textAlign: 'center',
    },
    text: {
        fontSize: 17,
        marginTop: 30,
        fontWeight:'500',
        marginBottom:10,
    },
    button: {
        backgroundColor: '#FF8F66',
        color: '#fff',
        margin: 10,
        padding: 20,
        borderRadius: 8,
        width: '55%',
        alignSelf: 'center',
        marginTop:40
      },
      buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 17,
      },
      textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        padding: 10,
      }
});


// option: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     margin: 5,
// }