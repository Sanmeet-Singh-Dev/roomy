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
                    style={styles.input}
                />

                <Text style={styles.text}>Number of Bathrooms</Text>
                <TextInput
                    placeholder="Enter number of bathrooms"
                    value={numBathrooms}
                    onChangeText={setNumBathrooms}
                    style={styles.input}
                />

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


                <Button
                    title="Next"
                    onPress={handleSaveAttributes}
                />

            </ScrollView>

        </View>
    )
}

export default RoomAttributes

const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
        padding: 30,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    option: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        margin: 5,
    },
    selectedOption: {
        backgroundColor: 'blue',
        borderColor: 'blue',
    },
    optionText: {
        color: 'black',
        textAlign: 'center',
    },
    text: {
        fontSize: 17,
        marginTop: 30,
    },
});
