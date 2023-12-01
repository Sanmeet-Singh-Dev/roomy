import { View, Text, SafeAreaView, Platform, StatusBar, Button, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const LoginOptions = () => {

  const navigation = useNavigation();
  return (

  
     <ImageBackground
      source={require('../assets/Splash-Screen.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Image
          source={require('../assets/roomyLogo34.png')}
          style={styles.icon}
        />
        <Text style={styles.text}>Welcome to Roomy!</Text>
      </View>
      <SafeAreaView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('register')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
            Already have an account? &nbsp;
            <Text style={{color:'#FF8F66', fontSize: 19, fontWeight: 500}} onPress={() => navigation.navigate('login')}>
            Login
            </Text>
            </Text>
      </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

export default LoginOptions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flex: 1,
    paddingTop:Platform.OS==='android' ? StatusBar.currentHeight : 0
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#51367B',
    color: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 22,
    borderRadius: 8,
    width: "75%",
    alignSelf: 'center',
  },
  text: {
    fontSize: 25,
    marginBottom: 120,
    textAlign: 'center',
    color:'#3F3F3F',
    fontWeight: "500",
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 150, 
    height: 150,
    marginTop: 250,
    marginBottom: 20,
  },
  loginText: {
    textAlign:'center', 
    marginTop: 20,
    fontSize: 19,
    fontWeight: 500,
  }
});