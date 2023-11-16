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
import UserInfo from '../components/UserInfo';


const Spaces = () => {
  const [listMySpaces, setListMySpaces] = useState([]);
  const iPAdress = IPADDRESS
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const { userId, setUserId } = useContext(UserType);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState("");

  useEffect(() => {
    const fetchDataAndGeocode = async () => {
      try {
        const response = await fetch(`http://${iPAdress}:6000/api/users/list-spaces`);
        if (response.ok) {
          const data = await response.json();


          // Geocoding logic
          const updatedListMySpaces = {};

          for (const spaceKey of Object.keys(data)) {
            const space = data[spaceKey];
            const { location } = space;

            if (location) {
              const { coordinates } = location;

              if (coordinates && coordinates.length === 2) {
                const [latitude, longitude] = coordinates;

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
      <View style={styles.container}>
        <SafeAreaView>
          <ScrollView >
            <View style={styles.header}>
              <UserInfo userId={userId} />
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
      </View>
    </ImageBackground>
  );
};

export default Spaces;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 15,
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
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    width: '60%',
    maxWidth: 400
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
