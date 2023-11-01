import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import FriendRequest from '../components/FriendRequest'

const ShowNotificationScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests ] = useState([]);
    let ipAddress = IPADDRESS;

    useEffect(() => {
        fetchFriendRequests();
    },[]);

    const fetchFriendRequests = async () => {
        try{
            const response = await axios.get(`http://${ipAddress}:6000/api/users/friend-request/${userId}`);
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
    
  return (
    <View style={{padding:10,marginHorizontal:12}}>
        {friendRequests.length > 0 && <Text>Your Friend Requests! </Text> }

        {friendRequests.map((item,index) => (
            <FriendRequest key={index} item={item} friendRequests={friendRequests} setFriendRequests={setFriendRequests}/>
        ))}
    </View>
  )
}

export default ShowNotificationScreen

const styles = StyleSheet.create({})