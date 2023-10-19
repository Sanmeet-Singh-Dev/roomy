import { View, Text, SafeAreaView, Platform, StatusBar, Button, TextInput } from 'react-native'
import React, {useState, useEffect} from 'react';
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
            const response = await fetch(`http://${ipAdress}:6000/api/users` , {
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