import { View, Text, SafeAreaView, StyleSheet, Platform, StatusBar, Button, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { IPADDRESS } from '@env'

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


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Enter your details</Text>

            <Text style={styles.label}>Name:</Text>
            <TextInput
                placeholder="Enter your name"
                value={name}
                onChangeText={(text) => setname(text)}
                style={styles.textInput}
            />
             <Text style={styles.label}>Email:</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.textInput}
            />
            
             <Text style={styles.label}>Password:</Text>
            <TextInput
                secureTextEntry
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.textInput}
            />

           <TouchableOpacity style={styles.button}>  
            <Text style={styles.buttonText} onPress={handleRegister}>Create Account</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#007AFF',
        color: '#fff',
        margin: 10,
        padding: 10,
        borderRadius: 8,
    },
    text: {
        fontSize: 25,
        marginBottom: 20,
        textAlign: 'center'
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        margin: 10,
        padding: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 10,
    },
})