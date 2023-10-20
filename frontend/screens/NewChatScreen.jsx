import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import NewChat from '../components/NewChat';
import { IPADDRESS } from "@env"

const ChatsScreen = () => {

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
    <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable>
            {acceptedFriends.map((item,index)=> (
                <NewChat key={index} item={item}/>
            ))}
        </Pressable>
    </ScrollView>
  )
}

export default ChatsScreen

const styles = StyleSheet.create({})