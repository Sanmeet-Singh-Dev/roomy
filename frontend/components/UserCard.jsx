import {  useFonts, 
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserCard = ({ userData }) => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [ userFriends , setUserFriends ] = useState([]);
  const ipAdress = IPADDRESS;

  useEffect(() => {
    const fetchUserFriends = async () => {
        try{
          const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            console.error('No authentication token available.');
            return;
          }
            const response = await fetch(`https://roomyapp.ca/api/api/users/friends/${userId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              }
            });
            const data = await response.json();
            if(response.ok){
                setUserFriends(data);
            }
            else {
                console.log("error ", response.status);
            }
        }catch(error){
        console.log("error ", error);
    }
    }

    fetchUserFriends();
},[userFriends]);

let [fontsLoaded] = useFonts({
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
});

if (!fontsLoaded) {
  return null;
}

if(userFriends.includes(userData.user._id)){
}

  const handlePress = () => {
    navigation.navigate('userSingleScreen', { user: userData });
  }

  return (
    <View style={styles.cardContainer}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.cardInnerContainer}>
          { userFriends.includes(userData.user._id) ? (
            <Image
            source={{ uri: userData.user.profilePhoto[0]}} 
          style={styles.image} />
          ) : (
            <Image
            source={{ uri: userData.user.profilePhoto[0]}}
          style={styles.image} blurRadius={20}/>
          ) }
          <View style={styles.userScore}>
            <Text style={styles.userScoreText}>{userData.score}%</Text>
          </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userData.user.name}</Text>
                <Text style={styles.userBudget}>Budget: ${userData.user.budget} / month</Text>
              </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 6,
    marginHorizontal: 0,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#333',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: '47%',
    paddingBottom: 20,
    paddingRight: 0,
    
  },
  cardInnerContainer: {
    position: 'relative',
    overflow: 'hidden',
    flex:1
  },
  image: {
   width:'100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 150,
    resizeMode:"cover"
  },
  userInfo: {
    marginTop: 15,
    marginLeft: 10,
    position: 'relative',
  },
  userName: {
    fontSize: 19,
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 5,
  },
  userScore: {
    position: 'absolute',
    top: 120,
    right: 5,
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 13,
    borderRadius: 100,
    elevation: 3,
    shadowColor: '#333',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  userScoreText: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FF8F66',
    padding: 0,
    margin: 0,
  },
  userBudget: {
    borderWidth: 0,
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#505050',
  }
});

export default UserCard;
