import { View, Text, SafeAreaView, Platform, StatusBar, Button, TextInput } from 'react-native'
import React, {useState, useEffect} from 'react';

const Register = () => {

    const [name, setname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            console.log('in try')
            const response = await fetch('http://192.168.1.94:6000/api/users' , {
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
                console.log('register successful!')
            } else {
            const data = await response.json();
            setError(data.message || 'Login failed. Please check your credentials.');
            console.log('Login failed. Please check your credentials.')
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('An error occurred. Please  try again later.');
        }
    };


    return (
        <View>
            <SafeAreaView>
                <Text>Enter your details</Text>
            </SafeAreaView>
            <TextInput
                placeholder="name"
                value={name}
                onChangeText={(text) => setname(text)} 
            />
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
                title="Create Account"
                onPress={handleRegister}
            />
        </View>
    )
}

export default Register