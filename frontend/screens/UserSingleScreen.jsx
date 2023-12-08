import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, TouchableOpacity, ImageBackground, Modal } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import { useNavigation } from '@react-navigation/native'
import SpaceCard from '../components/SpaceCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserSingleScreen = ({ route, onUnblockUser }) => {
  const { user } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  // Extract first name of user
  const firstName = user.user.name.split(" ")[0];

  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequets] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [recievedRequest, setRecievedRequest] = useState([]);
  let ipAdress = IPADDRESS;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        if (!token) {
          // Handle the case where the token is not available
          console.error('No authentication token available.');
          return;
        }
        const response = await fetch(`http://roomyapp.ca/api/api/users/friend-requests/sent/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token as a bearer token
          }
        });
        const data = await response.json();
        if (response.ok) {
          setFriendRequets(data);
        }
        else {
          console.log("error ", response.status);
        }
      } catch (error) {
        console.log("error ", error);
      }
    }

    fetchFriendRequests();

  }, [friendRequests]);

  useEffect(() => {
    const fetchRecievedRequests = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        if (!token) {
          // Handle the case where the token is not available
          console.error('No authentication token available.');
          return;
        }
        const response = await fetch(`http://roomyapp.ca/api/api/users/friend-requests/recieved/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token as a bearer token
          }
        });
        const data = await response.json();
        if (response.ok) {
          setRecievedRequest(data);
        }
        else {
          console.log("error ", response.status);
        }
      } catch (error) {
        console.log("error ", error);
      }
    }

    fetchRecievedRequests();

  }, [recievedRequest]);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
        const response = await fetch(`http://roomyapp.ca/api/api/users/friends/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token as a bearer token
          }
        });
        const data = await response.json();
        if (response.ok) {
          setUserFriends(data);
        }
        else {
          console.log("error ", response.status);
        }
      } catch (error) {
        console.log("error ", error);
      }
    }

    fetchUserFriends();
  }, [userFriends]);

  //  function to calculate age
 const calculateAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const currentDate = new Date();
  const navigation = useNavigation();
 
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


  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
      const response = await fetch(`http://roomyapp.ca/api/api/users/friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentUserId, selectedUserId })
      })

      if (response.ok) {
        setRequestSent(true);
        const message = "You have a new friend request from name";
        handleSend(currentUserId, selectedUserId, message);
      }
    }
    catch (error) {
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
      const response = await fetch(`http://roomyapp.ca/api/api/users/request-notification`, {
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
  const acceptRequest = async (friendRequestId) => {

    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        // Handle the case where the token is not available
        console.error('No authentication token available.');
        return;
      }
      const response = await fetch(`http://roomyapp.ca/api/api/users/friend-request/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`, 
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

  const declineRequest = async (friendRequestId) => {

    try {
      const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
        const response = await fetch(`http://roomyapp.ca/api/api/users/friend-request/decline`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                senderId: friendRequestId,
                recepientId: userId
            })
        })

        if (response.ok) {
            setFriendRequests(friendRequests.filter((request) => request._id !== friendRequestId));
             navigation.navigate('homePage' , {isReload:"truee"});
        }
    }
    catch (error) {
        console.log("Error Declining the friend request ", error);
    }
}

  const handleBlockUser = async (currentUserId, selectedUserId) => {

    try {
      const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
      const response = await fetch(`http://roomyapp.ca/api/api/users/block-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentUserId, selectedUserId })
      })

      if (response.ok) {
        console.log("Successfully blocked user");
        navigation.navigate('homePage', {isReload:"false"} );
      }
      else {
        console.log("error ", response.status);
      }
    }
    catch (error) {
      console.log("error ", error);
    }
  }

  const unfriendUser = async (currentUserId, selectedUserId) => {

    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        // Handle the case where the token is not available
        console.error('No authentication token available.');
        return;
      }
      const response = await fetch(`http://roomyapp.ca/api/api/users/unfriend-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentUserId, selectedUserId })
      })

      if (response.ok) {
        console.log("Successfully removed as a friend");
      }
      else {
        console.log("error ", response.status);
      }
    }
    catch (error) {
      console.log("error ", error);
    }
  }

 
  const navigateToSpaceDetails = (space) => {
    navigation.navigate('single-space', { space });
  };

  const userAge = calculateAge(user.user.dateOfBirth);

  const handleBack = () => {
    navigation.goBack();
  }

  return (
    <ImageBackground source={require('../assets/userSingleScreen.jpg')} style={styles.background}>
      <View>
        <View>
      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
          source={require('../assets/back.png')}
          style={styles.sortIcon}
        />
        <Text style={styles.sortText}>Roommate Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
                    style={styles.optionsButton}
                    onPress={() => setModalVisible(true)}
                >
                        <Text style={styles.optionsText}>...</Text>
                  
                </TouchableOpacity>
                 <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                    {userFriends.includes(user.user._id) ? (
                      <TouchableOpacity style={styles.modalOption} onPress={() => unfriendUser(userId, user.user._id)}>
                      <Text style={styles.modalText}>Unfriend</Text>
                  </TouchableOpacity>
                    ) : (
                      null
                    )}
                        <TouchableOpacity style={styles.modalOption} onPress={() => handleBlockUser(userId, user.user._id)}>
                            <Text style={styles.modalText}>Block</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
        </View>
        <View style={styles.contentContainer}>
          <SafeAreaView>
            <ScrollView>

              <View style={styles.imageOuterContainer}>
                <View style={styles.imageContainer}>
                  {userFriends.includes(user.user._id) ? (
                    <Image
                      source={{ uri: user.user.profilePhoto[0] }}
                      style={styles.image} />
                  ) : (
                    <Image
                      source={{ uri: user.user.profilePhoto[0] }}
                      style={styles.image} blurRadius={20} />
                  )}
                  <Text style={styles.userName}>{firstName},&nbsp;{userAge}
                   </Text>
                </View>
                <View style={styles.CompatibilityContainer}>
                  <Text style={styles.Compatibility}>Compatibility: {user.score}%</Text>
                </View>
              </View>
              <View style={styles.innerContentContainer}>
                <Text style={styles.overviewHeading}>Desired room overview</Text>
                <Text style={styles.userScore}>Budget: ${user.user.budget} / month</Text>
                <Text style={styles.heading}>Bio</Text>
                <Text style={styles.userBio}>{user.user.bio}</Text>
                <View>
                  {userFriends.includes(user.user._id) ? (
                     null
                  ) : requestSent || friendRequests.some((friend) => friend._id === user.user._id) ? (
                    <Pressable
                      style={styles.requestSentBtn}
                    >
                      <Text style={styles.btnText}>Request Sent</Text>
                    </Pressable>
                  ) : recievedRequest.some((friend) => friend._id === user.user._id) ? (
                    <View style={styles.adBtnContainer}>
                      <Pressable
                        onPress={() => acceptRequest(user.user._id)}
                        style={styles.acceptBtn}>
                        <Text style={styles.btnText}>Accept</Text>
                      </Pressable>
                      <Pressable
                      onPress={() => declineRequest(user.user._id)}
                      style={styles.declineBtn}>
                      <Text style={styles.declineBtnText}>Decline</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => sendFriendRequest(userId, user.user._id)}
                      style={styles.addFriendBtn}>
                      <Text style={styles.btnText}>Send Request</Text>
                    </Pressable>
                  )}
                </View>
                <Text style={styles.heading}>{firstName}'s Interests</Text>
                <View style={styles.optionContainer}>
                  {user.user.interests.map((interest, index) => (
                    <View style={styles.optionInnerContainer} key={index}>
                      <Text style={styles.option } >
                        {interest.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.heading}>{firstName}'s Traits</Text>
                <View style={styles.optionContainer}>
                  {user.user.traits.map((trait, index) => (
                    <View style={styles.optionInnerContainer} key={index}>
                      <Text style={styles.option}>
                        {trait.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Text>
                    </View>
                  ))}
                </View>
                    <TouchableOpacity   onPress={() => navigation.navigate('single-space', { space: user.user.listMySpace })}>
                <View>
                  <Text style={styles.heading}>{firstName}'s listings</Text>

                 {user.user.listMySpace && Object.keys(user.user.listMySpace).length > 4 && user.user.listMySpace.title ? (
                  <SpaceCard space={user.user.listMySpace} />
                 ) : (
                  <Text style={{fontSize: 16}}>Listings Not available!</Text>
                 )}
                </View>
                    </TouchableOpacity>
              </View>
            </ScrollView>
            {userFriends.includes(user.user._id) ? (
                    <View >
                      <Pressable
                       onPress={() => navigation.navigate("Messages", {
                        recepientId: user.user._id
                    })}
                    style={styles.fixedIconContainer}
                      >
                        <Image
          source={require('../assets/mesageFriend-icon.png')}
          style={styles.msgIcon}
        />
                      </Pressable>
                    </View> ) : (null)}
          </SafeAreaView>
        </View>
      </View>
    </ImageBackground>
  )
}

export default UserSingleScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  adBtnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentContainer: {
    margin: 19,
    marginBottom: 0,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: '#fff',
    marginBottom: "60%",
  },
  containerMain: {
    flex: 1,
    padding: 30,
  },
  innerBgContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  innerContentContainer: {
    padding: 20,
  },
  backIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: "15%",
    marginLeft: "2%",
    marginBottom: "5%",
  },
  sortIcon: {
    width: 30,
    height: 30,
    margin: 5,
  },
  sortText: {
    fontSize: 17,
    fontWeight: "500",
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    borderRadius: 15,
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
  optionInnerContainer: {
    backgroundColor: 'lightgray',
    borderRadius: 7,
    margin: 5,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontSize: 16,
  },
  imageOuterContainer: {
    position: 'relative',
    paddingBottom: 21,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
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
  CompatibilityContainer: {
    position: 'absolute',
    right: 25,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: '#FF8F66',
  },
  Compatibility: {
    fontSize: 16,
    fontWeight: 'bold',
    
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  userScore: {
    fontSize: 16,
  },
  userBio: {
    fontSize: 16,
    marginBottom: 18,
  },
  imageContainer: {
    position: 'relative',
  },
  overviewHeading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight:"500"
  },
  declineBtnText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight:"500"
  },
  friendsBtn: {
    backgroundColor: "#82CD47",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "45%",
  },
  unfriendBtn: {
    backgroundColor: "#d63838",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "45%",
  },
  requestSentBtn: {
    backgroundColor: "gray",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  acceptBtn: {
    backgroundColor: "#FF8F66",
    paddingVertical: 13,
    paddingHorizontal: 52,
    borderRadius: 8,
  },
  declineBtn: {
    paddingVertical: 13,
    paddingHorizontal: 52,
    borderRadius: 8,
    backgroundColor: "lightgray",
  },
  addFriendBtn: {
    backgroundColor: "#3E206D",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  blockBtn: {
    backgroundColor: "#d63838",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "100%",
  },
  btnsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    position: 'relative'
  },
  modalContainer: {
    position: 'absolute',
    top: 90,
    right: 17,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5, 
    shadowColor: 'black',  
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems:'center'
},
optionsButton: {
        
  position: 'absolute',
  top: 50,
  right: 20,
  backgroundColor: 'transparent',
  flexDirection: 'column',
  alignItems: 'center',
  

},
optionsText: {
  fontSize: 65,
  color: '#3b3b3b',
  marginVertical: -30
},
modalOption: {
  padding: 5,
},
modalText: {
  fontSize: 16
},
msgIcon: {
  width: 80,
  height: 80
},
fixedIconContainer: {
  position: 'absolute',
  bottom: 20,
  right: 140,
  zIndex: 1,
},
});