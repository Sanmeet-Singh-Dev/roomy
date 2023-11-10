import React, { useState, useEffect, useContext } from 'react';
import { Text, ScrollView, View, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { IPADDRESS } from '@env'
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native'
import SpaceCard from '../components/SpaceCard';
import { TextInput } from 'react-native-paper';
import { UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import { ImageBackground } from 'react-native';


const Spaces = () => {
  const [listMySpaces, setListMySpaces] = useState([]);
  const iPAdress = IPADDRESS
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const { userId, setUserId } = useContext(UserType);
  const [searchValue ,  setSearchValue ] = useState("");
  const [filteredData , setFilteredData ] = useState("");



const fetchUserData = async () => {
  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("jwt");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    setUserId(userId);
  };

  fetchUsers();
  try {
    const response = await fetch(`http://${iPAdress}:6000/api/users/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await response.json();
    setUserData(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

if(userId !== null && userId !== undefined && userId !== ""){
  fetchUserData();
}


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
    <ImageBackground source={require('../assets/Account.jpg')} style={styles.background}>
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.header}>
            <View>
              <Text style={styles.nameText}>Hello, {userData.name}!</Text>
              <Text style={styles.tagline}>Let's find the perfect room-mate for you ?</Text>
            </View>
            {userData.profilePhoto?.[0] ? (
              <Image
                source={{ uri: userData.profilePhoto?.[0]}} 
                style={styles.image}
              />              
            ) : ( <Text>profile picture N/A</Text> )}

          </View>

          <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>

            </View>

          <View style={styles.searchSortContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={searchValue}
                onChangeText={text => setSearchValue(text)}
                placeholder="Search"
              />

              <TouchableOpacity>
                <Image
                  source={require('../assets/search-zoom-in.png')}
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.iconContainer}>
                <Image
                  source={require('../assets/filter-add.png')}
                  style={styles.sortIcon}
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainer}>
                <Image
                  source={require('../assets/filter-add.png')}
                  style={styles.sortIcon}
                />
            </TouchableOpacity>
          </View>

        {Object.values(listMySpaces).map((space, index) => (
          <TouchableOpacity key={index} onPress={() => navigateToSpaceDetails(space)}>

            <SpaceCard key={index} space={space} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default Spaces;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'contain', based on your preference
    // Other image background styles
  }, container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginLeft: 5,
    marginRight: 5,
    padding: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, 
  },
  sortIcon: {
    width: 30,
    height: 30,
  },
  input: {
    flex: 1,
    paddingVertical: 2,
    backgroundColor: 'transparent',
  },
  searchSortContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  searchIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
    width: '60%',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
});
