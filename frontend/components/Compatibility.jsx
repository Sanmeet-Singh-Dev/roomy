import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '@env';

const Compatibility = () => {
  const [userPreferences, setUserPreferences] = useState(null);
  const [compatibilityScores, setCompatibilityScores] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Function to fetch user preferences
  const fetchUserPreferences = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/preferences`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${yourAuthToken}`, // Include your authentication token
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserPreferences(data.preferences);
      } else {
        console.error('Error fetching user preferences');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Call the function to fetch user preferences when the component mounts
    fetchUserPreferences();
  }, []);

  if (userPreferences) {
    // Now you have user preferences in the userPreferences state
    // You can use this data to calculate compatibility, similar to the previous example
    const compatibilityScore = calculateCompatibility(user1, userPreferences);

    // Render your component based on compatibilityScore and userPreferences
  }
      
  function calculateCompatibility(user1, user2) {
    // Define weights for different preferences
    const weights = {
      gender: 0.2,
      location: 0.1,
      smoking: 0.05, 
      drinking: 0.05,   
      guests: 0.05,      
      pets: 0.05,        
      food: 0.1,         
      interests: 0.2,   
      traits: 0.1,       
    };
  
    // Calculate the compatibility score based on preferences
    let compatibilityScore = 0;
  
    // Calculate smoking compatibility
    if (user1.smoking === user2.smoking) {
      compatibilityScore += weights.smoking;
    }
  
    // Calculate drinking compatibility
    if (user1.drinking === user2.drinking) {
      compatibilityScore += weights.drinking;
    }

    if (user1.guests === user2.guests) {
      compatibilityScore += weights.guests;
    }

    if (user1.pets === user2.pets) {
      compatibilityScore += weights.pets;
    }
  
    if (user1.food === user2.food) {
      compatibilityScore += weights.food;
    }

    // Calculate interests compatibility (e.g., Jaccard Index)
    const commonInterests = user1.interests.filter((interest) =>
      user2.interests.includes(interest)
    );

    const interestsCompatibility =
      commonInterests.length / (user1.interests.length + user2.interests.length);
    compatibilityScore += weights.interests * interestsCompatibility;
  
    // Calculate traits compatibility
    const commonTraits = user1.traits.filter((trait) => user2.traits.includes(trait));
    const traitsCompatibility = commonTraits.length / (user1.traits.length + user2.traits.length);
    compatibilityScore += weights.traits * traitsCompatibility;
  
    return compatibilityScore;
  }


  return (
    <View>
      <Text>Compatibility</Text>
    </View>
  )
}

export default Compatibility

const styles = StyleSheet.create({})