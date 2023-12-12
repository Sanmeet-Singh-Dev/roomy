import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Entypo } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { UserType } from '../UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { IPADDRESS } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatMessagesScreen = () => {
    const iPAdress = IPADDRESS;
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [message, setMessage] = useState("");
    const { userId, setUserId } = useContext(UserType);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [recepientData, setRecepientData] = useState();
    const [selectedImage, setSelectedImage] = useState("");
    const route = useRoute();
    const { recepientId } = route.params;

    const scrollViewRef = useRef(null);

    let ipAdress = IPADDRESS;

    useEffect(() => {
        scrollToBottom();
    },[])

    const scrollToBottom = () => {
        if(scrollViewRef.current){
            scrollViewRef.current.scrollToEnd({animated:true})
        }
    }

    const handleContentSizeChange = () => {
        scrollToBottom();
    }

    // console.log(recepientId);
    const navigation = useNavigation();

    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector);
    }

    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('jwt');
            if (!token) {
              // Handle the case where the token is not available
              console.error('No authentication token available.');
              return;
            }
            const response = await fetch(`https://roomyapp.ca/api/api/users/messages/${userId}/${recepientId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Include the token as a bearer token
                }
              })
            // console.log("response message",response)
            const data = await response.json();
            // console.log("Data ",data);
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
    }, [messages])

    useEffect(() => {
        const fetchRecepientData = async () => {
            try {
                const token = await AsyncStorage.getItem('jwt');
                if (!token) {
                  // Handle the case where the token is not available
                  console.error('No authentication token available.');
                  return;
                }
                const response = await fetch(`https://roomyapp.ca/api/api/users/user/${recepientId}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`, // Include the token as a bearer token
                    }
                  });
                // console.log("response ", response);
                const data = await response.json();
                // console.log("User data",data)
                setRecepientData(data);
            }
            catch (error) {
                console.log("Error retrieving details ", error);
            }
        }

        fetchRecepientData();
    }, [])

    const handleSend = async (messageType, imageUri) => {
        const temp = recepientId;
        try {
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("recepientId", temp);

            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg"
                })
            }
            else {
                formData.append("messageType", "text");
                formData.append("messageText", message);
            }

              function getFormDataValue(formData, fieldName) {
                for (const [key, value] of formData._parts) {
                  if (key === fieldName) {
                    return value;
                  }
                }
                return null;
              }
              const senderId = getFormDataValue(formData, "senderId");
              const recepientId = getFormDataValue(formData, "recepientId");
              const messageType = getFormDataValue(formData, "messageType");
              const messageText = getFormDataValue(formData, "messageText");

              const data = {
                senderId: senderId,
                recepientId: recepientId,
                messageType: messageType,
                messageText: messageText,
              };

              const token = await AsyncStorage.getItem('jwt');
              if (!token) {
                // Handle the case where the token is not available
                console.error('No authentication token available.');
                return;
              }
            const response = await fetch(`https://roomyapp.ca/api/api/users/messages`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                setMessage("");
                setSelectedImage("");


                fetchMessages();
            }
        }
        catch (error) {
            console.log("Error in sending message", error);
        }
    }

    // console.log("selected messages ", selectedMessages);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="arrow-back" size={24} color="black" />

                    {selectedMessages.length > 0 ? (
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>{selectedMessages.length}</Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image style={{ width: 30, height: 30, borderRadius: 15, resizeMode: "cover" }} source={{ uri: recepientData?.image }} />
                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", fontFamily: 'Outfit_500Medium' }}>{recepientData?.name}</Text>
                        </View>
                    )}
                </View>
            ),
            headerRight: () => selectedMessages.length > 0 ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
                    <Ionicons name="md-arrow-undo" size={24} color="black" />
                    <FontAwesome name="star" size={24} color="black" />
                    <MaterialIcons
                        onPress={() => deleteMessages(selectedMessages)}
                        name="delete" size={24} color="black" />
                </View>
            ) : 
            <FontAwesome 
            onPress={() => navigation.navigate('Calendar', {
                recepientId: recepientId
            })}
            name="calendar" size={18} color="black" />    
        })
    }, [recepientData, selectedMessages]);

    const deleteMessages = async (messageIds) => {
        try {
            const token = await AsyncStorage.getItem('jwt');
            if (!token) {
              // Handle the case where the token is not available
              console.error('No authentication token available.');
              return;
            }
            const response = await fetch(`https://roomyapp.ca/api/api/users/deleteMessages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ messages: messageIds })
            });

            if (response.ok) {
                setSelectedMessages((prevMessage) => prevMessage.filter((id) => !messageIds.includes(id)));
                fetchMessages();
            }
            else {
                console.log("Error in deleting messages", response.status);
            }
        } catch (error) {
            console.log("Error in deleting messages", error);
        }
    }

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };

    const pickimage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            handleSend("image", result.uri)
        }
    };

    const handleSelectMessage = (message) => {

        const isSelected = selectedMessages.includes(message._id);

        if (isSelected) {
            setSelectedMessages((prevmessage) => prevmessage.filter((id) => id !== message._id));
        }
        else {
            setSelectedMessages((prevMessage) => [...prevMessage, message._id])
        }
    }

    return (
        <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor:'#f5f5f5' }}
      extraScrollHeight={Platform.OS === 'ios' ? 10 : 0}
      enableOnAndroid={true}
    >
            <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow:1}} onContentSizeChange={handleContentSizeChange}>
                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        const isSelected = selectedMessages.includes(item._id)
                        return (
                            <Pressable
                                onLongPress={() => handleSelectMessage(item)}
                                key={index}
                                style={[
                                    item?.senderId?._id === userId ? {
                                        alignSelf: "flex-end",
                                        backgroundColor: "#EEEEEE",
                                        padding: 8,
                                        maxWidth: "60%",
                                        borderRadius: 7,
                                        margin: 10,
                                    } : {
                                        alignSelf: "flex-start",
                                        backgroundColor: "white",
                                        padding: 8,
                                        margin: 10,
                                        borderRadius: 7,
                                        maxWidth: "60%"
                                    },

                                    isSelected && { width: "100%", backgroundColor: "#F0FFFF" }
                                ]}>
                                <Text style={{ fontSize: 13, textAlign: isSelected ? "right" : "left", fontFamily: 'Outfit_400Regular', fontSize: 14, }}>{item?.message}</Text>
                                <Text style={{ textAlign: "right", fontSize: 9, color: "gray", marginTop: 5, fontFamily: 'Outfit_400Regular', fontSize: 9 }}>{formatTime(item?.timeStamp)}</Text>
                            </Pressable>
                        )
                    }

                    if (item.messageType === "image") {
                        const baseUrl = "/Users/anshulgupta/Documents/React Native Follow along/messenger-project/api/files/"
                        const imageUrl = item.imageUrl;
                        const fileName = imageUrl.split("/").pop();
                        const source = { uri: baseUrl + fileName }
                        return (
                            <Pressable
                                key={index}
                                style={[
                                    item?.senderId?._id === userId ? {
                                        alignSelf: "flex-end",
                                        backgroundColor: "#DCF8C6",
                                        padding: 8,
                                        maxWidth: "60%",
                                        borderRadius: 7,
                                        margin: 10
                                    } : {
                                        alignSelf: "flex-start",
                                        backgroundColor: "white",
                                        padding: 8,
                                        margin: 10,
                                        borderRadius: 7,
                                        maxWidth: "60%"
                                    }
                                ]}>

                                <View>
                                    <Image source={source} style={{ width: 200, height: 200, borderRadius: 7 }} />
                                    <Text style={{ textAlign: "right", fontSize: 9, color: "gray", bottom: 7, right: 10, position: "absolute", marginTop: 5, color: "white" }}>{formatTime(item?.timeStamp)}</Text>
                                </View>
                            </Pressable>
                        )
                    }
                })}
            </ScrollView>
            <View style={{ flexDirection: "row", alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#dddddd", marginBottom: showEmojiSelector ? 0 : 25 }}>
                <Entypo
                    onPress={handleEmojiPress}
                    style={{ marginRight: 5 }} name="emoji-happy" size={24} color="gray" />
                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{ flex: 1, height: 40, borderWidth: 1, borderColor: "#dddddd", borderRadius: 20, paddingHorizontal: 10, fontFamily: 'Outfit_400Regular', fontSize: 16 }} placeholder='Type your message' />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginHorizontal: 8 }}>

                    <Entypo
                        onPress={pickimage}
                        name="camera" size={24} color="gray" />

<FontAwesome 
            onPress={() => navigation.navigate('Calendar', {
                recepientId: recepientId
            })}
            name="calendar" size={18} color="black" />   
                    
                </View>
                <Pressable
                    onPress={() => handleSend("text")}
                    style={{ backgroundColor: "#FF8F66", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 }}>
                    <Text style={{ color: "white", fontWeight: "bold", fontFamily: 'Outfit_500Medium' }}>Send</Text>
                </Pressable>
            </View>

            {showEmojiSelector && (
                <EmojiSelector style={{ height: 330 }} onEmojiSelected={(emoji) => {
                    setMessage((prevMessage) => prevMessage + emoji)
                }} />
            )}
        </KeyboardAwareScrollView>
    )
}

export default ChatMessagesScreen

const styles = StyleSheet.create({})