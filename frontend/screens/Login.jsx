import { View, Text, SafeAreaView, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigation = useNavigation();

    const handleLogin = async () => {
    try {
        console.log('handleLogin');
        const response = await fetch('http://192.168.1.76:6000/api/users/auth' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
        });

        console.log(response);

        if (response.ok) { 
            const data = await response.json();
            const token = data.token;

            const userName = data.name;
            console.log(userName);
            
            await AsyncStorage.setItem('jwt', token);

            navigation.navigate('home', { userName: userName });
        } else {
            const data = await response.json();
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
        <View>
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