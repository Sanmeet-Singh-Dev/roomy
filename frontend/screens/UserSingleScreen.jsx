import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import { useNavigation } from '@react-navigation/native'

const UserSingleScreen = ({ route   }) => {
    //user data
    const { user } = route.params;

    const { userId, setUserId } = useContext(UserType);
  const [requestSent , setRequestSent] = useState(false);
    const [friendRequests, setFriendRequets] = useState([]);
    const [ userFriends, setUserFriends ] = useState([]);
    const [ recievedRequest , setRecievedRequest ] = useState([]);
    let ipAdress = IPADDRESS;
    const navigation = useNavigation();

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
      // setUserFriends(data);
        console.log("Successfully blocked user");
        const message = "name has blocked you"
        handleSend(currentUserId , selectedUserId , message);
    }
    else {
        console.log("error ", response.status);
    }
}
catch(error){
    console.log("error ", error);
}
}

const unfriendUser = async ( currentUserId, selectedUserId ) => {

  try{
    const response = await fetch(`http://${ipAdress}:6000/api/users/unfriend-user`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify({currentUserId,selectedUserId})
    })

    if(response.ok){
        console.log("Successfully removed as a friend");
        const message = "name has removed you as a friend"
        handleSend(currentUserId , selectedUserId , message);
    }
    else {
        console.log("error ", response.status);
    }
}
catch(error){
    console.log("error ", error);
}
}

    //function to calculate age
    const calculateAge = (dateOfBirth) => {
      const birthDate = new Date(dateOfBirth);
      const currentDate = new Date();
    
      const age = currentDate.getFullYear() - birthDate.getFullYear();
    
      // Check if the user's birthday has occurred this year
      if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }
    
      return age;
    };
    const navigateToSpaceDetails = (space) => {
      navigation.navigate('single-space', { space });
    };

    //storing user age in a variable
    const userAge = calculateAge(user.user.dateOfBirth);

  return (
    <View>
        <SafeAreaView>
            <ScrollView>
              <View style={styles.imageContainer}>
                <Image 
                 source={{ uri: user.user.profilePhoto[0]}} 
                style={styles.image} />
                <Text style={styles.userName}>{user.user.name}, {userAge}</Text>
              </View>
              <View style={styles.CompatibilityContainer}>
                <Text style={styles.Compatibility}>Compatibility: {user.score}%</Text>
              </View>
              <Text style={styles.heading}>Desired room overview</Text>
              <Text style={styles.userScore}>Budget: ${user.user.budget} / month</Text>
              <Text style={styles.heading}>Bio</Text>
              <Text style={styles.userScore}>{user.user.bio}</Text>

              <View style={{display:"flex", flexDirection:"row" , justifyContent:"space-around"}}>
      
            {userFriends.includes(user.user._id) ? (
            <View style={{display:"flex", flexDirection:"row" , justifyContent:"space-around"}}>
            <Pressable
              style ={{backgroundColor:"#82CD47",padding:8,borderRadius:6,width:85, marginRight:40}}
              >
                  <Text style={{textAlign:"center",color:"white",fontSize:13}}>Friends</Text>
            </Pressable>

              <Pressable
              onPress={() => unfriendUser(userId, user.user._id)}
              style ={{backgroundColor:"#82CD47",padding:8,borderRadius:6,width:85}}
                >
                <Text style={{textAlign:"center",color:"white",fontSize:13}}>Unfriend</Text>
                </Pressable>
                </View>
              ) : requestSent || friendRequests.some((friend) => friend._id === user.user._id) ? (
            <Pressable
              style ={{backgroundColor:"gray",padding:8,borderRadius:6,width:85}}
              >
                  <Text style={{textAlign:"center",color:"white",fontSize:13}}>Request Sent</Text>
              </Pressable>
              ) :  recievedRequest.some((friend) => friend._id === user.user._id)  ? (
            <Pressable
              onPress={() => acceptRequest(user.user._id)}
              style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}>
              <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
            </Pressable>
              ) : (
            <Pressable 
              onPress={() => sendFriendRequest(userId , user.user._id) }
              style ={{backgroundColor:"#567189",padding:8,borderRadius:6,width:85}}>
              <Text style={{textAlign:"center",color:"white",fontSize:13}}>Add Friend</Text>
            </Pressable>
              )}

            <Pressable
              onPress={() => handleBlockUser(userId , user.user._id) }
              style ={{backgroundColor:"#d63838",padding:8,borderRadius:6,width:85}}>
              <Text style={{textAlign:"center",color:"white",fontSize:13}}>Block User</Text>
            </Pressable>
          </View>
              
              <Text style={styles.heading}>{user.user.name}'s Interests</Text>
              <View style={styles.optionContainer}>
                {user.user.interests.map((interest, index) => (
                    <Text style={styles.option} key={index}>{interest}</Text>
                ))}
              </View>
              <Text style={styles.heading}>{user.user.name}'s Traits</Text>
              <View style={styles.optionContainer}>
                {user.user.traits.map((trait, index) => (
                    <Text style={styles.option} key={index}>{trait}</Text>
                ))}
              </View>
              
              <TouchableOpacity   onPress={() => navigation.navigate('single-space', { space: user.user.listMySpace })}>
              <View>
                <Text style={styles.heading}>{user.user.name}'s listings</Text>
                  {user.user.listMySpace.description ? (
                    <View>
                      <Image 
                       source={{ uri: user.user.listMySpace.images[0]}} 
                      style={styles.image} />
                      <Text style={styles.title}>{user.user.listMySpace.title}</Text>
                      <Text style={styles.description}>{user.user.listMySpace.description}</Text>
                      <Text style={styles.rent}>Rent</Text>
                      <Text style={styles.budget}>{user.user.listMySpace.budget} cad/month</Text>
                    </View>
       
                  ) : (
                    <Text>{user.user.name} has not listed any spaces yet.</Text>
                  )}
                  
              </View>
              </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    </View>
  )
}

export default UserSingleScreen

const styles = StyleSheet.create({
    containerMain: {
      flex: 1,
      padding: 30,
    },
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },
    title: {
      marginVertical: 10,
      fontSize: 18,
    },
    description: {
      marginVertical: 10,
      fontSize: 16,
    },
    rent: {
      marginVertical: 10,
      fontSize: 16,
      color: '#797979',
    },
    budget: {
      fontSize: 19,
    },
    optionContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    option: {
      borderWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      margin: 5,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 8,
    },
    userInfo: {
      marginLeft: 10,
    },
    userName: {
      fontSize: 25,
      fontWeight: 'bold',
      position: 'absolute',
      bottom: 20,
      left: 10,
      color: '#fff',

    },
    Compatibility: {
      fontSize: 16,
      fontWeight: 'bold',
      backgroundColor: '#FF8F66',
      color: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 10,
    },
    CompatibilityContainer: {
      position: 'absolute',
      top: 170,
      right: 25,
    },
    userScore: {
      fontSize: 16,
    },
    imageContainer: {
      position: 'relative',
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
});