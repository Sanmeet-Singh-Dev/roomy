import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const SpaceDetails = ({ route }) => {
  const { space } = route.params;
  console.log(space);

  return (
    <ScrollView>
      <View style={styles.card}>
        <Text style={styles.title}>Title: {space.title}</Text>
        <Text style={styles.description}>Description: {space.description}</Text>
        <Text style={styles.budget}>Budget: {space.budget}</Text>
        <Text style={styles.location}>Location: {space.fullAddress || 'Address not available'}</Text>
        
        <Text style={styles.numOfBedrooms}>Number of Bedrooms: {space.numOfBedrooms || 'N/A'}</Text>
        <Text style={styles.numOfBathroom}>Number of Bathrooms: {space.numOfBathroom || 'N/A'}</Text>
        <Text style={styles.availability}>Availability: {space.availability || 'N/A'}</Text>
        <Text style={styles.roomSuitability}>Room Suitability: {space.roomSuitability || 'N/A'}</Text>
        <Text style={styles.petFriendly}>Pet Friendly: {space.petFriendly || 'N/A'}</Text>
        <Text style={styles.furnished}>Furnished: {space.furnished || 'N/A'}</Text>
        
        <Text style={styles.imageLabel}>Images:</Text>
        <View style={styles.imageContainer}>
          {space.images.map((imageUrl, imgIndex) => (
            <Image key={imgIndex} source={{ uri: imageUrl }} style={styles.image} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 15,
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
  numOfBedrooms: {
    fontSize: 16,
    marginBottom: 8,
  },
  numOfBathroom: {
    fontSize: 16,
    marginBottom: 8,
  },
  availability: {
    fontSize: 16,
    marginBottom: 8,
  },
  roomSuitability: {
    fontSize: 16,
    marginBottom: 8,
  },
  petFriendly: {
    fontSize: 16,
    marginBottom: 8,
  },
  furnished: {
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
});

export default SpaceDetails;
