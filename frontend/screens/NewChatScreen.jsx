import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import NewChat from '../components/NewChat';
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

    const handleBack = () => {
        navigation.goBack();
    };

  return (
    <ImageBackground source={require('../assets/Account.jpg')} style={styles.background}>
        <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
            <Image
            source={require('../assets/back.png')}
            style={styles.sortIcon}
            />
            <Text style={styles.sortText}>New Messages</Text>
        </TouchableOpacity>
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:"white"}}>
                <Pressable>
                    {acceptedFriends.map((item,index)=> (
                        <NewChat key={index} item={item}/>
                    ))}
                </Pressable>
            </ScrollView>
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
    container: {
        marginTop: "2%",
        borderRadius: 15,
        backgroundColor: '#fff',
        height: "100%",
    },
    backIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: "15%",
        marginLeft: "2%",
        marginBottom: "5%",
    },
    sortIcon: {
        width: 30,
        height: 30,
        margin: 5,
    },
    sortText: {
        fontSize: 17,
        fontWeight: "500",
    },
})