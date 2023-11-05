import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { IPADDRESS } from '@env'
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native'

const Spaces = () => {
  const [listMySpaces, setListMySpaces] = useState([]);
  const iPAdress = IPADDRESS
  const navigation = useNavigation();
  useEffect(() => {
    const fetchDataAndGeocode = async () => {
      try {
        const response = await fetch(`http://${iPAdress}:6000/api/users/list-spaces`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched listMySpaces data:', data);

          // Geocoding logic
          const updatedListMySpaces = {};

          for (const spaceKey of Object.keys(data)) {
            const space = data[spaceKey];
            const { location } = space;

            if (location) {
              const { coordinates } = location;

              if (coordinates && coordinates.length === 2) {
                const [latitude, longitude] = coordinates;
                console.log('Geocoding coordinates:', latitude, longitude);

                try {
                  const [addressData] = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude,
                  });

                  if (addressData) {
                    let fullAddress = '';

                    if (addressData.name) {
                      fullAddress += `${addressData.name}, `;
                    }
                    if (addressData.street) {
                      fullAddress += `${addressData.street}, `;
                    }
                    if (addressData.city) {
                      fullAddress += `${addressData.city}, `;
                    }
                    if (addressData.country) {
                      fullAddress += addressData.country;
                    }

                    fullAddress = fullAddress.replace(/, $/, '');
                    space.fullAddress = fullAddress;
                  } else {
                    console.warn('Reverse geocoding returned no data for coordinates:', coordinates);
                  }
                } catch (error) {
                  console.error('Error reverse-geocoding location:', error);
                }
              }
            }

            updatedListMySpaces[spaceKey] = space;
          }

          setListMySpaces(updatedListMySpaces);
        } else {
          console.error('Failed to fetch listMySpaces data');
        }
      } catch (error) {
        console.error('Error while fetching listMySpaces data:', error);
      }
    };


    fetchDataAndGeocode();
  }, []);

  const navigateToSpaceDetails = (space) => {
    navigation.navigate('single-space', { space });
  };

  return (
  <ScrollView>
  {Object.values(listMySpaces).map((space, index) => (
     <TouchableOpacity key={index} onPress={() => navigateToSpaceDetails(space)}>
    <View key={index} style={styles.card}>
      <Text style={styles.title}>Title: {space.title}</Text>
      <Text  style={styles.description}>Description: {space.description}</Text>
      <Text style={styles.budget}>Budget: {space.budget}</Text>
      <Text style={styles.location}>Location: {space.fullAddress || 'Address not available'}</Text>
      <Text style={styles.imageLabel}>Images:</Text>
      <View style={styles.imageContainer}>
      {space.images.map((imageUrl, imgIndex) => (
        <Image
          key={imgIndex}
          source={{ uri: imageUrl }}
          style={styles.image}
        />
      ))}
      <View style={styles.optionContainer}>
                {space.attributes.map((attribute, index) => (
                    <Text style={styles.option} key={index}>{attribute}</Text>
                ))}
      </View>

      </View>
    </View>
    </TouchableOpacity>
  ))}
</ScrollView>
);
};

export default Spaces;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 15
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
   
  },
  budget: {
    fontSize: 16,
    marginBottom: 8,

  },
  location: {
    fontSize: 16,
    marginBottom: 8,
    
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
  },
});
