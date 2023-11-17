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
    shadowOpacity: 0.3,
    shadowRadius: 2,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  userScore: {
    position: 'absolute',
    top: 120,
    right: 5,
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  userScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8F66',
  },
});

export default UserCard;
