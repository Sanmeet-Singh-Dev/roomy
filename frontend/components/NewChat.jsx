import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserType } from '../UserContext';

const UserChat = ({ item }) => {
    const navigation = useNavigation();
    const { userId, setUserId } = useContext(UserType);

    return (
        <Pressable
            onPress={() => navigation.navigate("Messages", {
                recepientId: item._id
            })}
            style={{ flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 0.7, borderColor: "#D0D0D0", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, padding: 10 }}>
            <Image style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }} source={{ uri: item?.image }} />

            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.name}</Text>
            </View>
        </Pressable>
    )
}

export default UserChat

const styles = StyleSheet.create({})