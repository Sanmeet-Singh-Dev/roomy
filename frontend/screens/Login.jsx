import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { IPADDRESS } from "@env"
import { ImageBackground } from 'react-native';

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

            const token = data.token;

            const userName = data.name;
            
            await AsyncStorage.setItem('jwt', token);

            navigation.navigate('home', { userName: userName });
        } else {
            
            setError(data.message || 'Login failed. Please check your credentials.');
            console.log('Login failed. Please check your credentials.')
        }
    } catch (error) {
        console.error('Fetch:', error);
        setError('An error occurred. Please  try again later.');
        console.log('An error occurred. Please  try again later.')
    }
    };

    return (
      <ImageBackground source={require('../assets/Account.jpg')} style={styles.background}>
            <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Sign In</Text>
            <Text style={styles.headingBottom}>Enter your credentials to access your account</Text>

            <Text style={styles.label}>Email:</Text>
            <TextInput
            placeholder="Email"
            placeholderTextColor="#FF8F66"
            value={email}
            onChangeText={(text) => setEmail(text)} 
            style={styles.textInput}
            />

             <Text style={styles.label}>Password:</Text>    
            <TextInput
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#FF8F66"
            value={password}
            onChangeText={(text) => setPassword(text)} 
            style={styles.textInput}
            />

            <TouchableOpacity style={styles.button}  onPress={handleLogin}>  
            <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            </SafeAreaView> 
            </ImageBackground>    
    )
}

export default Login

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
      flex: 1,
      padding: 30,
        backgroundColor: '#3E206D',
        marginTop: 80,
        borderRadius: 40
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
        fontSize: 24,
        fontWeight: 'bold',
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
      headingBottom: {
        color: 'white',
        marginTop: 10,
        marginBottom: 60,
        textAlign: 'center'
      }
})