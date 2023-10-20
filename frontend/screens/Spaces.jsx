import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, Image } from 'react-native';
import { IPADDRESS } from '@env'
import * as Location from 'expo-location';

const Spaces = () => {
  const [listMySpaces, setListMySpaces] = useState([]);
  const iPAdress = IPADDRESS
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
  return (
  <ScrollView>
  <Text>Spaces</Text>
  {Object.values(listMySpaces).map((space, index) => (
    <View key={index}>
      <Text>Title: {space.title}</Text>
      <Text>Description: {space.description}</Text>
      <Text>Budget: {space.budget}</Text>
      <Text>Location: {space.fullAddress || 'Address not available'}</Text>
      <Text>Images:</Text>
      {space.images.map((imageUrl, imgIndex) => (
        <Image
          key={imgIndex}
          source={{ uri: imageUrl }}
          style={{ width: 100, height: 100 }}
        />
      ))}
    </View>
  ))}
</ScrollView>
);
};

export default Spaces;
