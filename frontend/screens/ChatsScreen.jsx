import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';

const ChatsScreen = () => {

    const [acceptedFriends , setAcceptedFriends ] = useState([]);
    const { userId, setUserId } = useContext(UserType);

    const navigation = useNavigation();

    console.log(userId);

    useEffect(()=> {
        
    },[])

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable>
            {acceptedFriends.map((item,index)=> (
                <UserChat key={index} item={item}/>
            ))}
        </Pressable>
    </ScrollView>
  )
}

export default ChatsScreen

const styles = StyleSheet.create({})