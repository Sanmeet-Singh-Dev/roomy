import React, { useContext }  from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"

const BlockedUserCard = ({ userData }) => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const ipAdress = IPADDRESS;

  const handlePress = () => {
    navigation.navigate('userSingleScreen', { user: userData });
  }

  const handleUnblockUser = async ( currentUserId, selectedUserId ) => {
    try{
      const response = await fetch(`http://${ipAdress}:6000/api/users/unblock-user`,{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body:JSON.stringify({currentUserId,selectedUserId})
      })
  
      if(response.ok){
          console.log("Successfully Unblocked user");
          const message = "name has unblocked you"
          handleSend(currentUserId , selectedUserId , message);
          navigation.goBack();
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

        const response = await fetch(`http://${ipAdress}:6000/api/users/request-notification`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
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
        <View>
          <Image source={{ uri: userData.user.profilePhoto[0]}} style={styles.image} />
          <View style={{display:'flex', flexDirection:"row", justifyContent:"space-between"}}>
          <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
          </View>
          <Pressable
          onPress={() => handleUnblockUser(userId , userData._id) }
          style ={{backgroundColor:"#82CD47",padding:8,borderRadius:6,width:85, marginLeft:40}}
          >
              <Text style={{textAlign:"center",color:"white",fontSize:13}}>Unlbock</Text>
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

export default BlockedUserCard;
