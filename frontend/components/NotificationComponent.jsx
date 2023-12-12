import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IPADDRESS } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationComponent = ( {notification }) => {

    const ipAdress = IPADDRESS;
    const recepientId = notification.senderId;
    const [ recepientData, setRecepientData ] = useState();

    useEffect(() => {
        const fetchRecepientData = async () => {
            try {
              const token = await AsyncStorage.getItem('jwt');
              if (!token) {
                // Handle the case where the token is not available
                console.error('No authentication token available.');
                return;
              }
                const response = await fetch(`https://roomyapp.ca/api/api/users/user/${recepientId}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the token as a bearer token
                  }
                });
                const data = await response.json();
                setRecepientData(data);
            }
            catch (error) {
                console.log("Error retrieving details ", error);
            }
        }

        fetchRecepientData();
    }, [recepientData])
    
  return (
    <View style={styles.reqContainer} >
        {recepientData ? (
            <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: recepientData.image }} />
            ) : (
            null
        ) }
      <Text style={{ fontSize: 15, marginLeft: 10, flex: 1, color: "#333333" }}>{notification.message}</Text>
    </View>
  )
}

export default NotificationComponent

const styles = StyleSheet.create({
  reqContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 9,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "2%",
  }
})