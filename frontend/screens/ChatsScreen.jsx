import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';
import { Entypo } from '@expo/vector-icons';
import { IPADDRESS } from "@env"
import { ImageBackground } from 'react-native';

const ChatsScreen = () => {

    const iPAdress = IPADDRESS;
    const [acceptedFriends , setAcceptedFriends ] = useState([]);
    const { userId, setUserId } = useContext(UserType);

    const navigation = useNavigation();
    let ipAdress = IPADDRESS;

    useEffect(()=> {
        const acceptedFriendsList = async () => {
            try{
                const response = await fetch(`http://${ipAdress}:6000/api/users/accepted-friends/${userId}`);
                const data = await response.json();
                if(response.ok){
                    setAcceptedFriends(data);
                }
            }
            catch(err){
                console.log("Error showing accepted friends",err);
            }
        };

        acceptedFriendsList();
    },[])

  return (
    <ImageBackground source={require('../assets/chats.jpg')} style={styles.background}>
        <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable style={{margin:10, borderRadius: 20, marginLeft: 20, marginRight: 20}}>
                {acceptedFriends.map((item,index)=> (
                    <UserChat key={index} item={item}/>
                ))}
            </Pressable>
        </ScrollView>
        <Pressable
        onPress={() => navigation.navigate("newChat")} 
            style={{ position:"absolute" , right:-40 ,top:500, padding:50, marginBottom:"20%" }}>
            <Image
            source={require('../assets/newmessage-icon.png')}
            style={styles.icon}
            />
        </Pressable>
        </View>
    </ImageBackground>
  )
}

export default ChatsScreen

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    icon: {
        width: 90, 
        height: 90, 
        marginBottom: 20,
    },
    container: {
        backgroundColor: 'transparent',
        marginTop: "20%",
        height: "100%",
    }
})