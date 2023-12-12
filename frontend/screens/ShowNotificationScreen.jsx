import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import FriendRequest from '../components/FriendRequest'
import NotificationComponent from '../components/NotificationComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

Text.defaultProps = {
  ...Text.defaultProps,
  style: [{ fontFamily: 'Outfit', color: "blue" }],
};

const ShowNotificationScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests ] = useState([]);
    const [notifications , setNotifications ] = useState([]);
    
    let ipAddress = IPADDRESS;
    const navigation = useNavigation();

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
            const response = await axios.get(`https://roomyapp.ca/api/api/users/friend-request/${userId}`, {
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
            const response = await axios.get(`https://roomyapp.ca/api/api/users/notifications/${userId}`, {
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

    const handleBack = () => {
      navigation.goBack();
    }

  return (
    <ImageBackground source={require('../assets/Requests.jpg')} style={styles.background}>
    <SafeAreaView>
    <ScrollView>
    <View>
    <View style={{padding:10,marginHorizontal:12}}>
      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
          source={require('../assets/back.png')}
          style={styles.sortIcon}
        />
        <Text style={styles.sortText}>Notifications</Text>
      </TouchableOpacity>
        <View style={styles.notificationType}>
          <Text style={styles.notificationText}>All Requests</Text>
        </View>

        {friendRequests.length > 0 ? (

            friendRequests.map((item,index) => (
                <FriendRequest key={index} item={item} friendRequests={friendRequests} setFriendRequests={setFriendRequests}/>
            ))
        ) : (
          <View style={styles.notificationTypeNo}>
            <Text style={styles.notificationText}>No Requests</Text>
          </View>
        )}
        
    </View>
    <View style={{padding:10,marginHorizontal:12}}>
    {notifications.length > 0 &&
    <View style={styles.notificationType}>
      <Text style={styles.notificationText}>All Notifications</Text>
    </View> }

    {notifications.map((notification, index) => (
                <NotificationComponent key={index} notification={notification}/>
            ))}
</View>
</View>
</ScrollView>
</SafeAreaView>
</ImageBackground>
  )
}

export default ShowNotificationScreen

const styles = StyleSheet.create({
  backIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: "2%",
    marginBottom: "6%",
    marginLeft: "-3%",
  },
  notificationType: {
    backgroundColor: "#fff",
    width: "60%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 30,
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    marginBottom: "3%",
  },
  notificationText: {
    fontSize: 17,
    fontWeight: "500",
    marginLeft: "4%",
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
})