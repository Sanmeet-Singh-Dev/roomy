import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';
import UserChat from '../components/UserChat';
import { Entypo } from '@expo/vector-icons';
import { IPADDRESS } from "@env"

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
    <View>
    <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable>
            {acceptedFriends.map((item,index)=> (
                <UserChat key={index} item={item}/>
            ))}
        </Pressable>
    </ScrollView>
    <Pressable
    onPress={() => navigation.navigate("newChat")} 
        style={{ position:"absolute" , right:0,top:550, padding:50, marginBottom:"20%" }}>
        <Entypo name="new-message" size={24} color="black" />
    </Pressable>
    </View>
  )
}

export default ChatsScreen

const styles = StyleSheet.create({})