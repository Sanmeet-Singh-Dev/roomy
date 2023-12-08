import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import { IPADDRESS } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();
    const ipAddress = IPADDRESS;

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
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    senderId: friendRequestId,
                    recepientId: userId
                })
            })

            if (response.ok) {
                setFriendRequests(friendRequests.filter((request) => request._id !== friendRequestId));
                const message = "name has accepted your friend request";
                 handleSend(userId, friendRequestId, message);
                 navigation.navigate('homePage' , {isReload:"tru"});
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
    return (
        <View style={styles.reqContainer}>
          <Pressable style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 }}>
              <View style={styles.contentContainer}>
                <View style={styles.imageTextContainer}>
                  <Image style={{ width: 52, height: 52, borderRadius: 25 }} source={{ uri: item.image }} />
                  <Text style={{ fontSize: 16, marginLeft: 10, flex: 1, color: "#333333" }}>{item?.name} sent you a friend request</Text>
                </View>
                <View style={styles.btnContainer}>
                <Pressable
                    onPress={() => acceptRequest(item._id)}
                    style={styles.acceptBtn}>
                    <Text style={styles.acceptBtnText}>Accept</Text>
                </Pressable>
                <Pressable
                    onPress={() => declineRequest(item._id)}
                    style={styles.declineBtn}>
                    <Text style={styles.declineBtnText}>Decline</Text>
                </Pressable>
                </View>
              </View>
          </Pressable>
        </View>
    )
}

export default FriendRequest

const styles = StyleSheet.create({
    declineBtnText: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff"
  },
  acceptBtn: {
    backgroundColor: "#FF8F66",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  acceptBtnText: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff"
  },
  declineBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#FF8F66"
  },
  imageTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1
  },
  btnContainer: {
    display:"flex",
    flexDirection:"row",
    justifyContent: "flex-end",
    gap:10
  },
  reqContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 9,
    marginBottom: "2%",
  }
})