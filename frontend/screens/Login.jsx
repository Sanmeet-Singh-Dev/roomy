import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { IPADDRESS } from "@env"

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigation = useNavigation();
    let ipAdress = IPADDRESS;

    const handleLogin = async () => {
    try {
        console.log('handleLogin');
        console.log(ipAdress)
        const response = await fetch(`http://${ipAdress}:6000/api/users/auth` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
        });

        if (response.ok) { 
            const data = await response.json();
            console.log('done');
            const token = data.token;

            const userName = data.name;
            
            await AsyncStorage.setItem('jwt', token);

            navigation.navigate('home', { userName: userName });
        } else {
            
            setError(data.message || 'Login failed. Please check your credentials.');
            console.log('Login failed. Please check your credentials.')
        }
    } catch (error) {
        console.error('Fetch error:', error);
        setError('An error occurred. Please  try again later.');
        console.log('An error occurred. Please  try again later.')
    }
    };

    return (
            <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Welcome Back Roomy</Text>

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
            <Text style={styles.buttonText} onPress={handleLogin}>Login</Text>
            </TouchableOpacity>
            </SafeAreaView>     
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 50,
      
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
        textAlign: 'center',
        marginTop: 20,
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