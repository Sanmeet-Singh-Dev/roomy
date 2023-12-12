import { View, Text, SafeAreaView, StyleSheet, Platform, StatusBar, Button, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { IPADDRESS } from '@env'
import { ImageBackground } from 'react-native';
import {  useFonts, 
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  } from '@expo-google-fonts/outfit';

const Register = () => {

    const [name, setname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let ipAdress = IPADDRESS;

    let [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_500Medium,
        Outfit_600SemiBold,
        Outfit_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const navigation = useNavigation();

    const handleRegister = async () => {
        try {
            const response = await fetch(`https://roomyapp.ca/api/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                await AsyncStorage.setItem('jwt', token);

                navigation.navigate('details');
            } else {
                const data = await response.json();
                console.log(data.message || 'Registration failed. Please check your credentials.');
                console.error('Registration failed.');
            }
        } catch (error) {
            console.error('Fetch error:', error);

        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleSignup = () => {
        navigation.navigate('login');
    }


    return (
        <ImageBackground source={require('../assets/Account.jpg')} style={styles.background}>
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Create your account</Text>
            <Text style={styles.headingBottom}>Enter the fields below to get started</Text>

            <Text style={styles.label}>Full Name:</Text>
            <TextInput
                placeholder="Enter name"
                placeholderTextColor="#AFB1B6"
                value={name}
                onChangeText={(text) => setname(text)}
                style={styles.textInput}
            />
             <Text style={styles.label}>Email:</Text>
            <TextInput
                placeholder="Enter Email"
                placeholderTextColor="#AFB1B6"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.textInput}
            />
            
             <Text style={styles.label}>Password:</Text>
            <TextInput
                secureTextEntry
                placeholder="Create Password"
                placeholderTextColor="#AFB1B6"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.textInput}
            />

           <TouchableOpacity style={styles.button} onPress={handleRegister}>  
            <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.createText}>Already have an account?</Text>
              <TouchableOpacity onPress={handleSignup}>  
                <Text style={styles.signUpText}>&nbsp;Log In</Text>
              </TouchableOpacity>
            </View>

        </SafeAreaView>
        </ImageBackground>
    )
}

export default Register

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover'
      },
      container: {
        flex: 1,
        padding: 30,
        backgroundColor: '#3E206D',
        marginTop: 80,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
    },
    headingBottom: {
        color: '#EEEEEE',
        marginBottom: 50,
        textAlign: 'center',
        fontFamily: 'Outfit_400Regular',
      },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 19,
        fontFamily: 'Outfit_600SemiBold',
    },
    button: {
        backgroundColor: '#FF8F66',
        color: '#fff',
        margin: 10,
        marginTop: "25%",
        marginLeft: 45,
        marginRight: 45,
        paddingLeft: 23,
        paddingRight: 23,
        paddingTop: 18,
        paddingBottom: 18,
        borderRadius: 8,
    },
    text: {
        fontSize: 28,
        marginBottom: 18,
        textAlign: 'center',
        color:'#EEEEEE',
        marginTop:60,
        fontFamily: 'Outfit_600SemiBold',
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        margin: 10,
        marginLeft: 30,
        marginRight: 30,
        padding: 10,
        color:'#EEEEEE',
        fontFamily: 'Outfit_400Regular',
    },
    label: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        marginLeft: 30,
        marginRight: 30,
        color:'#EEEEEE',
    },
    signUpContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: "2%"
    },
        createText: {
        color: "#EEEEEE",
        fontSize: 17,
        fontFamily: 'Outfit_400Regular',
    },
        signUpText: {
        color: "#FF8F66",
        fontSize: 17,
        fontFamily: 'Outfit_600SemiBold',
    },
})