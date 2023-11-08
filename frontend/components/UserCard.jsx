import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"

const UserCard = ({ userData }) => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [ userFriends , setUserFriends ] = useState([]);
  const ipAdress = IPADDRESS;

  useEffect(() => {
    const fetchUserFriends = async () => {
        try{
            const response = await fetch(`http://${ipAdress}:6000/api/users/friends/${userId}`);
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

if(userFriends.includes(userData.user._id)){
}

  const handlePress = () => {
    navigation.navigate('userSingleScreen', { user: userData });
  }

  return (
    <View style={styles.cardContainer}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View>
       { userFriends.includes(userData.user._id) ? (
        <Image
        source={{ uri: userData.user.profilePhoto[0]}} 
       style={styles.image} />
       ) : (
        <Image
        source={{ uri: userData.user.profilePhoto[0]}} 
       style={styles.image} blurRadius={20}/>
       ) }
          <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.user.name}</Text>
              <Text style={styles.userScore}>{userData.score}%</Text>
              <Text style={styles.userScore}>Budget: ${userData.user.budget} / month</Text>
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
    padding: 10,
    margin: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#333',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userScore: {
    fontSize: 16,
    marginBottom: 10
  },
});

export default UserCard;
