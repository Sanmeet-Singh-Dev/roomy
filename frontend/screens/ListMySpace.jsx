import React ,{ useState, useContext, useEffect }  from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ScrollView,SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import { IPADDRESS } from '@env';
import SpaceCard from '../components/SpaceCard';
import { ImageBackground } from 'react-native';


const ListMySpace = () => {
  const route = useRoute();
  const userName = route.params?.userName;
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const [spaces, setSpaces] = useState([]);
  let iPAdress = IPADDRESS;

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("jwt");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUserSpaces = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        const response = await fetch(`http://${iPAdress}:6000/api/users/users/${userId}/spaces`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token as a bearer token
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const responseData = await response.json();
        const spacesData = responseData;
        setSpaces(spacesData);
      } catch (error) {
        console.error('Error fetching user spaces:', error);
      }
    };

    fetchUserSpaces();
  }, [spaces]);
  const handleListMySpace = () => {
    navigation.navigate('listingOne');
  };

  const fetchUserSpaces = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
    
      const response = await fetch(`http://${iPAdress}:6000/api/users/users/${userId}/spaces`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token as a bearer token
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const responseData = await response.json();
      const spacesData = responseData;
      setSpaces(spacesData);
    } catch (error) {
      console.error('Error fetching user spaces:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/Account.jpg')} style={styles.background}>
    <SafeAreaView style={styles.safeAreaView}>
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.listingText}>I want to list my Space</Text>
      <TouchableOpacity style={styles.button} onPress={handleListMySpace}>
        <Text style={styles.buttonText}>List My Space</Text>
      </TouchableOpacity>
      <Text style={styles.listingText}>My Listings</Text>
        {/* {spaces && <SpaceCard space={spaces} />} */}
        {spaces && Object.keys(spaces).length > 4 && spaces.title && <SpaceCard space={spaces} showOptions={true} onReload={() => fetchUserSpaces()}/>}
    </View>
    </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'contain', based on your preference
    // Other image background styles
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:20,
    padding:15

  },
  safeAreaView: {
    flex: 1,
  },
  button: {
    backgroundColor: '#FF8F66',
    padding: 10,
    borderRadius: 8,
    width:"100%",
    height:60,
    marginBottom:20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign:'center',
    alignContent:'center',
    paddingTop:8,
    fontWeight: '500',
  },
  listingText: {
    alignSelf: 'flex-start',
    marginTop: 25,
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 15,
  }
});

export default ListMySpace;