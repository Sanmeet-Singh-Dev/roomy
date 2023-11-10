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
        console.log(userId)
        const response = await fetch(`http://${iPAdress}:6000/api/users/users/${userId}/spaces`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const responseData = await response.json();
        const spacesData = responseData;
        setSpaces(spacesData);
        console.log(spacesData)
      } catch (error) {
        console.error('Error fetching user spaces:', error);
      }
    };

    fetchUserSpaces();
  }, []);
  const handleListMySpace = () => {
    navigation.navigate('listingOne');
  };

  return (
    <ImageBackground source={require('../assets/Account.jpg')} style={styles.background}>
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
    <View style={styles.container}>
      <Text style={styles.listingText}>I want to List My Space</Text>
      <TouchableOpacity style={styles.button} onPress={handleListMySpace}>
        <Text style={styles.buttonText}>List My Space</Text>
      </TouchableOpacity>
      <Text style={styles.listingText}>My Listing</Text>
        {/* {spaces && <SpaceCard space={spaces} />} */}
        {spaces && Object.keys(spaces).length > 4 && spaces.title && <SpaceCard space={spaces} />}
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

  },
  safeAreaView: {
    flex: 1,
  },
  button: {
    backgroundColor: '#FF8F66',
    padding: 10,
    borderRadius: 5,
    width:390,
    height:60,
    marginBottom:20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign:'center',
    alignContent:'center',
    paddingTop:8
  },
  listingText: {
    alignSelf: 'flex-start',
    marginTop: 25,
    paddingLeft: 25,
    fontSize: 20,
    fontWeight: 'semibold',
    marginBottom: 15,
  }
});

export default ListMySpace;