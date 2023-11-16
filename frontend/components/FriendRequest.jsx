import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import { IPADDRESS } from "@env"

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();
    const ipAddress = IPADDRESS;

    const acceptRequest = async (friendRequestId) => {

        try {
            const response = await fetch(`http://${ipAddress}:6000/api/users/friend-request/accept`, {
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
                setFriendRequests(friendRequests.filter((request) => request._id !== friendRequestId));
                const message = "name has accepted your friend request";
                 handleSend(userId, friendRequestId, message);
                 navigation.navigate('homePage' , {isReload:true});
            }
        }
        catch (error) {
            console.log("Error accepting the friend request ", error);
        }
    }

    const handleSend = async (currentUserId, selectedUserId, message) => {
        try {
          const data = {
            senderId: currentUserId,
            recepientId: selectedUserId,
            message: message
          };
    
          const response = await fetch(`http://${ipAddress}:6000/api/users/request-notification`, {
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
        <Pressable style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 }}>
            <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.image }} />
            <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}>{item?.name} sent you a friend request</Text>

            <Pressable
                onPress={() => acceptRequest(item._id)}
                style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}>
                <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
            </Pressable>
        </Pressable>
    )
}

export default FriendRequest

const styles = StyleSheet.create({})