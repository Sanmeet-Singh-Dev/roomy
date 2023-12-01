import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IPADDRESS } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserInfo = (userId) => {
   
    let iPAdress = IPADDRESS;
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
                const response = await fetch(`http://${iPAdress}:6000/api/users/user/${userId.userId}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`, // Include the token as a bearer token
                    }
                  });
                const data = await response.json();
                setUserData(data);
            }
            catch (error) {
                console.log("Error retrieving details ", error);
            }
        }

        fetchUserData();
    }, [userId])

    return (
        <View style={styles.header}>
            <View style={styles.textContainer}>
                <Text style={styles.nameText}>Hello, {userData.name}!</Text>
                <Text style={styles.tagline}>Let's find the perfect room-mate for you ?</Text>
            </View>
            {userData.profilePhoto?.[0] ? (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: userData.profilePhoto?.[0] }}
                        style={styles.image}
                    />
                </View>
            ) : (<Text>profile picture N/A</Text>)}
        </View>
    )
}

export default UserInfo

const styles = StyleSheet.create({
    nameText: {
        fontSize: 20,
        marginTop: 20,
    },
    tagline: {
        fontSize: 13,
        color: '#797979',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#FF8F66",
    },
    imageContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: 20,
        marginBottom: 15,
        width: "100%",
    },
})