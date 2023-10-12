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
        <Button
          title='Register'
          onPress={() => navigation.navigate('register')}
        />
        <Text>Hello2 test</Text>
      </SafeAreaView>
    </View>
  )
}

export default LoginOptions