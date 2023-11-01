import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"

const UserCard = ({ userData }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('userSingleScreen', { user: userData });
  }


  const { userId, setUserId } = useContext(UserType);
  const [requestSent , setRequestSent] = useState(false);
    const [friendRequests, setFriendRequets] = useState([]);
    const [ userFriends, setUserFriends ] = useState([]);
    const [ recievedRequest , setRecievedRequest ] = useState([]);
    let ipAdress = IPADDRESS;

    useEffect(() => {
      const fetchFriendRequests = async () => {
          try{
              const response = await fetch(`http://${ipAdress}:6000/api/users/friend-requests/sent/${userId}`);
              const data = await response.json();
              if(response.ok){
                  setFriendRequets(data);
              }
              else {
                  console.log("error ", response.status);
              }
          }catch(error){
          console.log("error ", error);
      }
      }

      fetchFriendRequests();

  },[friendRequests]);

  useEffect(() => {
    const fetchRecievedRequests = async () => {
        try{
            const response = await fetch(`http://${ipAdress}:6000/api/users/friend-requests/recieved/${userId}`);
            const data = await response.json();
            if(response.ok){
                setRecievedRequest(data);
            }
            else {
                console.log("error ", response.status);
            }
        }catch(error){
        console.log("error ", error);
    }
    }

    fetchRecievedRequests();

},[recievedRequest]);

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

  const sendFriendRequest = async (currentUserId, selectedUserId ) => {
      try{
          const response = await fetch(`http://${ipAdress}:6000/api/users/friend-request`,{
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body:JSON.stringify({currentUserId,selectedUserId})
          })

          if(response.ok){
              setRequestSent(true);
              const message = "You have a new friend request from name";
              handleSend(currentUserId, selectedUserId, message);
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
  const acceptRequest = async (friendRequestId) => {

    try {
        const response = await fetch(`http://${ipAdress}:6000/api/users/friend-request/accept`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senderId: friendRequestId,
                recepientId: userId
            })
        })

        if (response.ok) {
            setFriendRequets(friendRequests.filter((request) => request._id !== friendRequestId));
            const message = "name has accepted your friend request";
              handleSend(userId, friendRequestId, message);
        }
    }
    catch (error) {
        console.log("Error accepting the friend request ", error);
    }
}

const handleBlockUser = async ( currentUserId, selectedUserId ) => {

  try{
    const response = await fetch(`http://${ipAdress}:6000/api/users/block-user`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify({currentUserId,selectedUserId})
    })

    if(response.ok){
      console.log("Successfully blocked user");
      const message = "name has blocked you"
      handleSend(currentUserId , selectedUserId , message);
    }
}
catch(error){
    console.log("error ", error);
}
}

return (
  <View style={styles.cardContainer}>
    <TouchableWithoutFeedback onPress={handlePress}>
      <View>
        <Image source={{ uri: userData.user.profilePhoto[0]}} style={styles.image} />
        <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData.user.name}</Text>
            <Text style={styles.userScore}>{userData.score}%</Text>
            <Text style={styles.userScore}>Budget: ${userData.user.budget} / month</Text>

          <View style={{display:"flex", flexDirection:"row" , justifyContent:"space-around"}}>
      
            {userFriends.includes(userData.user._id) ? (
            <Pressable
              style ={{backgroundColor:"#82CD47",padding:8,borderRadius:6,width:85}}
              >
                  <Text style={{textAlign:"center",color:"white",fontSize:13}}>Friends</Text>
            </Pressable>
              ) : requestSent || friendRequests.some((friend) => friend._id === userData.user._id) ? (
            <Pressable
              style ={{backgroundColor:"gray",padding:8,borderRadius:6,width:85}}
              >
                  <Text style={{textAlign:"center",color:"white",fontSize:13}}>Request Sent</Text>
              </Pressable>
              ) :  recievedRequest.some((friend) => friend._id === userData.user._id)  ? (
            <Pressable
              onPress={() => acceptRequest(userData.user._id)}
              style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}>
              <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
            </Pressable>
              ) : (
            <Pressable 
              onPress={() => sendFriendRequest(userId , userData.user._id) }
              style ={{backgroundColor:"#567189",padding:8,borderRadius:6,width:85}}>
              <Text style={{textAlign:"center",color:"white",fontSize:13}}>Add Friend</Text>
            </Pressable>
              )}

            <Pressable
              onPress={() => handleBlockUser(userId , userData.user._id) }
              style ={{backgroundColor:"#d63838",padding:8,borderRadius:6,width:85}}>
              <Text style={{textAlign:"center",color:"white",fontSize:13}}>Block User</Text>
            </Pressable>
          </View>

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
