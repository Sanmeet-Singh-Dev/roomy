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
            const response = await fetch(`http://${ipAddress}:6000/api/users/friend-request/accept`, {
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
            const response = await fetch(`http://${ipAddress}:6000/api/users/friend-request/decline`, {
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
          const response = await fetch(`http://${ipAddress}:6000/api/users/request-notification`, {
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
        <Pressable style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 }}>
            <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.image }} />
            <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}>{item?.name} sent you a friend request</Text>

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
        </Pressable>
    )
}

export default FriendRequest

const styles = StyleSheet.create({
    declineBtnText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight:"500"
  },
  declineBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor:"#FF8F66"
  },
  acceptBtn: {
    backgroundColor: "#FF8F66",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  acceptBtnText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight:"500",
    color: "#fff"
  },
  btnContainer: {
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    gap:10
  }
})