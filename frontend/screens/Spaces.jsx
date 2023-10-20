import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, Image } from 'react-native';
import { IPADDRESS } from '@env'

const Spaces = () => {
  const [listMySpaces, setListMySpaces] = useState([]);
  const iPAdress = IPADDRESS

  useEffect(() => {
    // Make an API request to fetch the listMySpaces data from your server
    const fetchListMySpaces = async () => {
      try {
        const response = await fetch(`http://${iPAdress}:6000/api/users/list-spaces`);
        if (response.ok) {
          const data = await response.json();
          // Assuming the API response is an array of listMySpaces objects
          setListMySpaces(data);
        } else {
          console.error('Failed to fetch listMySpaces data');
        }
      } catch (error) {
        console.error('Error while fetching listMySpaces data:', error);
      }
    };

    fetchListMySpaces(); // Call the fetchListMySpaces function when the component mounts
  }, []); // The empty dependency array ensures it only runs once on component mount

  return (
    <ScrollView>
      <Text>Spaces</Text>
      {listMySpaces.map((space, index) => (
        <View key={index}>
          <Text>Title: {space.title}</Text>
          <Text>Description: {space.description}</Text>
          <Text>Budget: {space.budget}</Text>
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
