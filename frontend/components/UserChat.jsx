import { Pressable, StyleSheet, Text, View, Image, Platform  } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserChat = ({ item }) => {
    const iPAdress = IPADDRESS;
    const navigation = useNavigation();
    const { userId, setUserId } = useContext(UserType);
    const [messages, setMessages] = useState([]);
    let ipAdress = IPADDRESS;

    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
            const response = await fetch(`http://${ipAdress}:6000/api/users/messages/${userId}/${item._id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Include the token as a bearer token
                }
              })
            const data = await response.json();
            if (response.ok) {
                setMessages(data);
            }
            else {
                console.log("error showing messages", response.status.message);
            }
        }
        
        catch (error) {
            console.log("Error fetching messages", error)
        }
    }

    useEffect(() => {
        fetchMessages();
    }, [messages]);


    const getLastMessage = () => {
        const userMessage = messages.filter((message) => message.messageType === "text");
        const n = userMessage.length;
        return userMessage[n-1];
    };

    const lastMessage = getLastMessage();

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };

    
    return (
        lastMessage ? 
        <Pressable
            onPress={() => navigation.navigate("Messages", {
                recepientId: item._id
            })}
            style={styles.chatCardContainer}>
            <Image style={{ width: 50, height: 50, borderRadius: 10, resizeMode: "cover" }} source={{ uri: item?.image }} />

            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.name}</Text>
                {lastMessage && (
                    <Text style={{ color: "gray", marginTop: 3, fontWeight: "500" }}>{lastMessage?.message}</Text>
                )}
                
            </View>

            <View>
                <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
                    {lastMessage && formatTime(lastMessage?.timeStamp)}
                </Text>
            </View>
        </Pressable> : <></>
    )
}

export default UserChat

const styles = StyleSheet.create({
    chatCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        ...Platform.select({
            ios: {
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            },
            android: {
            elevation: 4,
            },
        }),
    },

})