import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IPADDRESS } from "@env"

const NotificationComponent = ( {notification }) => {

    const ipAdress = IPADDRESS;
    const recepientId = notification.senderId;
    const [ recepientData, setRecepientData ] = useState();

    useEffect(() => {
        const fetchRecepientData = async () => {
            try {
                const response = await fetch(`http://${ipAdress}:6000/api/users/user/${recepientId}`);
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
    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10}} >
        {recepientData ? (
            <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: recepientData.image }} />
            ) : (
            null
        ) }
      <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}>{notification.message}</Text>
    </View>
  )
}

export default NotificationComponent

const styles = StyleSheet.create({})