import { View, Text, SafeAreaView, StyleSheet, TextInput, Button } from 'react-native'
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
        <View style={styles.container}>
            <SafeAreaView>
                <Text>Welcome To Roomy</Text>
            </SafeAreaView>
            <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)} 
            />

            <TextInput
            secureTextEntry
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)} 
            />

            <Button
                title="Login"
                onPress={handleLogin}
            />
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 30,
    },
})