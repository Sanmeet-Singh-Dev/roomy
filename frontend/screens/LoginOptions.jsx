import { View, Text, SafeAreaView, Platform, StatusBar, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const LoginOptions = () => {

  const navigation = useNavigation();
  return (
    <View style={{ backgroundColor: "#fff", flex: 1, paddingTop:Platform.OS==='android' ? StatusBar.currentHeight : 0 }}>
      <SafeAreaView>
        <Button
          title='Login'
          onPress={() => navigation.navigate('login')}
        />
        <Text>Hello</Text>
        <Button
          title='Register'
          onPress={() => navigation.navigate('register')}
        />
      </SafeAreaView>
    </View>
  )
}

export default LoginOptions