import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import { useNavigation } from '@react-navigation/native'
import SpaceCard from '../components/SpaceCard';

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


const UserSingleScreen = ({ route, onUnblockUser }) => {
  const { user } = route.params;

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
        const response = await fetch(`http://${ipAdress}:6000/api/users/friend-requests/sent/${userId}`);
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
        const response = await fetch(`http://${ipAdress}:6000/api/users/friend-requests/recieved/${userId}`);
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
        const response = await fetch(`http://${ipAdress}:6000/api/users/friends/${userId}`);
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

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch(`http://${ipAdress}:6000/api/users/friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  const handleBlockUser = async (currentUserId, selectedUserId) => {

    try {
      const response = await fetch(`http://${ipAdress}:6000/api/users/block-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId })
      })

      if (response.ok) {
        console.log("Successfully blocked user");
        const message = "name has blocked you"
        handleSend(currentUserId, selectedUserId, message);
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
      const response = await fetch(`http://${ipAdress}:6000/api/users/unfriend-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId })
      })

      if (response.ok) {
        console.log("Successfully removed as a friend");
        const message = "name has removed you as a friend"
        handleSend(currentUserId, selectedUserId, message);
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

    // console.log('Component is rendering...');

  //storing user age in a variable
  const userAge = calculateAge(user.user.dateOfBirth);

  // console.log('user age is: ', userAge);

  return (
    <ImageBackground source={require('../assets/Account.jpg')} style={styles.background}>
      <View>
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
                  <Text style={styles.userName}>{firstName}, {userAge}</Text>
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
                    <View style={styles.btnsContainer}>
                      <Pressable
                        style={styles.friendsBtn}
                      >
                        <Text style={styles.btnText}>Friends</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => unfriendUser(userId, user.user._id)}
                        style={styles.unfriendBtn}
                      >
                        <Text style={styles.btnText}>Unfriend</Text>
                      </Pressable>
                    </View>
                  ) : requestSent || friendRequests.some((friend) => friend._id === user.user._id) ? (
                    <Pressable
                      style={styles.requestSentBtn}
                    >
                      <Text style={styles.btnText}>Request Sent</Text>
                    </Pressable>
                  ) : recievedRequest.some((friend) => friend._id === user.user._id) ? (
                    <Pressable
                      onPress={() => acceptRequest(user.user._id)}
                      style={styles.acceptBtn}>
                      <Text style={styles.btnText}>Accept</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => sendFriendRequest(userId, user.user._id)}
                      style={styles.addFriendBtn}>
                      <Text style={styles.btnText}>Add Friend</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => handleBlockUser(userId, user.user._id)}
                    style={styles.blockBtn}>
                    <Text style={styles.btnText}>Block User</Text>
                  </Pressable>
                </View>
                <Text style={styles.heading}>{firstName}'s Interests</Text>
                <View style={styles.optionContainer}>
                  {user.user.interests.map((interest, index) => (
                    <View style={styles.optionInnerContainer}>
                      <Text style={styles.option} key={index}>
                        {interest.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.heading}>{firstName}'s Traits</Text>
                <View style={styles.optionContainer}>
                  {user.user.traits.map((trait, index) => (
                    <View style={styles.optionInnerContainer}>
                      <Text style={styles.option} key={index}>
                        {trait.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Text>
                    </View>
                  ))}
                </View>
                    <TouchableOpacity   onPress={() => navigation.navigate('single-space', { space: user.user.listMySpace })}>
                <View>
                  <Text style={styles.heading}>{firstName}'s listings</Text>

                  <SpaceCard space={user.user.listMySpace} />




                  {/* {user.user.listMySpace.description ? (
                    <View>
                      <Image
                        source={{ uri: user.user.listMySpace.images[0] }}
                        style={styles.image} />
                      <Text style={styles.title}>{user.user.listMySpace.title}</Text>
                      <Text style={styles.description}>{user.user.listMySpace.description}</Text>
                      <Text style={styles.rent}>Rent</Text>
                      <Text style={styles.budget}>{user.user.listMySpace.budget} cad/month</Text>
                    </View>
                  ) : (
                    <Text>{firstName} has not listed any spaces yet.</Text>
                  )} */}
                </View>
                    </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </ImageBackground>
  )
}

export default UserSingleScreen

const styles = StyleSheet.create({
  contentContainer: {
    margin: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  containerMain: {
    flex: 1,
    padding: 30,
  },
  innerContentContainer: {
    padding: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
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
    backgroundColor: '#EEEEEE',
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
    fontSize: 16,
  },
  friendsBtn: {
    backgroundColor: "#82CD47",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "fit-content",
  },
  unfriendBtn: {
    backgroundColor: "#d63838",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "fit-content",
  },
  requestSentBtn: {
    backgroundColor: "gray",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  acceptBtn: {
    backgroundColor: "#0066b2",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  addFriendBtn: {
    backgroundColor: "#567189",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  blockBtn: {
    backgroundColor: "#d63838",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "fit-content",
  },
  btnsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  }
});