import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IPADDRESS } from '@env'

const UserInfo = (userId) => {
   
    let iPAdress = IPADDRESS;
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://${iPAdress}:6000/api/users/user/${userId.userId}`);
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
            <View>
                <Text style={styles.nameText}>Hello, {userData.name}!</Text>
                <Text style={styles.tagline}>Let's find the perfect room-mate for you ?</Text>
            </View>
            {userData.profilePhoto?.[0] ? (
                <Image
                    source={{ uri: userData.profilePhoto?.[0] }}
                    style={styles.image}
                />
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
        marginLeft: 20,
        borderWidth: 3,
        borderColor: "#FF8F66"
      },
      header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
      },

})