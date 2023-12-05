import { View, Text, SafeAreaView, StyleSheet, Platform, StatusBar, Button, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { IPADDRESS } from '@env'
import { ImageBackground } from 'react-native';

const Register = () => {

    const [name, setname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let ipAdress = IPADDRESS;

    const navigation = useNavigation();

    const handleRegister = async () => {
        try {
            const response = await fetch(`http://${ipAdress}:6000/api/users`, {
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


    return (
        <ImageBackground source={require('../assets/Account.jpg')} style={styles.background}>
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Enter your details</Text>

            <Text style={styles.label}>Full Name:</Text>
            <TextInput
                placeholder="Enter your full name"
                placeholderTextColor="#AFB1B6"
                value={name}
                onChangeText={(text) => setname(text)}
                style={styles.textInput}
            />
             <Text style={styles.label}>Email:</Text>
            <TextInput
                placeholder="Email"
                placeholderTextColor="#AFB1B6"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.textInput}
            />
            
             <Text style={styles.label}>Password:</Text>
            <TextInput
                secureTextEntry
                placeholder="Password"
                placeholderTextColor="#AFB1B6"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.textInput}
            />

           <TouchableOpacity style={styles.button} onPress={handleRegister}>  
            <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

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
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#FF8F66',
        color: '#fff',
        margin: 10,
        marginTop: 60,
        marginLeft: 45,
        marginRight: 45,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 14,
        paddingBottom: 14,
        borderRadius: 8,
    },
    text: {
        fontSize: 25,
        marginBottom: 60,
        textAlign: 'center',
        color:'#EEEEEE',
        marginTop:60
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
        color:'#EEEEEE'

    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 30,
        marginRight: 30,
        color:'#EEEEEE',


    },
})