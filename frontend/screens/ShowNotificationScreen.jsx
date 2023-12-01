import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import FriendRequest from '../components/FriendRequest'
import NotificationComponent from '../components/NotificationComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShowNotificationScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests ] = useState([]);
    const [notifications , setNotifications ] = useState([]);
    let ipAddress = IPADDRESS;

    useEffect(() => {
        fetchFriendRequests();
        fetchUserNotifications();
    },[notifications]);

    const fetchFriendRequests = async () => {
        try{
            const token = await AsyncStorage.getItem('jwt');
            if (!token) {
              console.error('No authentication token available.');
              return;
            }
            const response = await axios.get(`http://${ipAddress}:6000/api/users/friend-request/${userId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Include the token as a bearer token
                }
              });
            if(response.status == 200){
                const friendRequestsData = response.data.map((friendRequest) => ({
                    _id: friendRequest._id,
                    name: friendRequest.name,
                    email: friendRequest.email,
                    image: friendRequest.image
                }))

                setFriendRequests(friendRequestsData);
            }
        }
        catch(error){
            console.log("error ", error);
        }
    }

    const fetchUserNotifications = async () => {
        try{
            const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            console.error('No authentication token available.');
            return;
          }
            const response = await axios.get(`http://${ipAddress}:6000/api/users/notifications/${userId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                }
              });
            if(response.status == 200){
                const notificationsData = response.data.map((notifications) => ({
                    senderId: notifications.senderId,
                    message: notifications.message
                }))
                setNotifications(notificationsData);
            }
            else{
                console.log("Error");
            }
        }
        catch(error){
            console.log("error ", error);
        }
    }

  return (
    <SafeAreaView>
    <ScrollView>
    <View>
    <View style={{padding:10,marginHorizontal:12}}>
        <Text>Your Friend Requests! </Text>

        {friendRequests.length > 0 ? (

            friendRequests.map((item,index) => (
                <FriendRequest key={index} item={item} friendRequests={friendRequests} setFriendRequests={setFriendRequests}/>
            ))
        ) : (
            <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, marginTop: 10 }}> No Requests!</Text>
        )}
        
    </View>
    <View style={{padding:10,marginHorizontal:12}}>
    {notifications.length > 0 && <Text style={{marginTop: 20}}>Your Other Notifications</Text> }

    {notifications.map((notification, index) => (
                <NotificationComponent key={index} notification={notification}/>
            ))}
</View>
</View>
</ScrollView>
</SafeAreaView>
  )
}

export default ShowNotificationScreen

const styles = StyleSheet.create({})