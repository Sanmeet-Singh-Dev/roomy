import React, { useContext }  from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';

const BlockedUserCard = ({ userData }) => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const ipAdress = IPADDRESS;

  const handleUnblockUser = async ( currentUserId, selectedUserId ) => {
    try{
      const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
      const response = await fetch(`http://${ipAdress}:6000/api/users/unblock-user`,{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`,
          },
          body:JSON.stringify({currentUserId,selectedUserId})
      })
  
      if(response.ok){
          console.log("Successfully Unblocked user");
          navigation.navigate('homePage' , {isReload:"true"});
      }
      else {
          console.log("error ", response.status);
      }
  }
  catch(error){
      console.log("error ", error);
  }
  }

  const handleSend = async (currentUserId, selectedUserId, message) => {
    try {
          const data = {
            senderId: currentUserId,
            recepientId: selectedUserId,
            message: message
          };

          const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
        const response = await fetch(`http://${ipAdress}:6000/api/users/request-notification`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
          console.log("Request notification sent successfully.");
        }
    }
    catch (error) {
        console.log("Error in sending notification", error);
    }
}

  return (
    <View style={styles.cardContainer}>
        <View style={styles.contentContainer}>
          <Image source={{ uri: userData.profilePhoto[0]}} style={styles.image} />
          <View style={styles.textImageContainer}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{userData.name}</Text>
            </View>
            <Pressable
              onPress={() => handleUnblockUser(userId , userData._id) }
              style ={{backgroundColor:"#82CD47",padding:10,borderRadius:6,width:85}}
              >
              <Text style={{textAlign:"center",color:"white",fontSize:16}}>Unblock</Text>
            </Pressable>
          </View>
        </View>
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
  userName: {
    fontSize: 21,
    fontWeight: 'bold',
  },
  userScore: {
    fontSize: 16,
    marginBottom: 10
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    width: '100%',
    gap: 10,
  },
  textImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: "flex-start",
    justifyContent: "space-between",
    alignContent: "flex-start",
    height: 100,
  }
});

export default BlockedUserCard;