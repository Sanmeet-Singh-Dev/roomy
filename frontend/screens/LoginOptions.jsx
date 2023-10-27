import { View, Text, SafeAreaView, Platform, StatusBar, Button, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const LoginOptions = () => {

  const navigation = useNavigation();
  return (
  //   <View style={styles.container}>
  //     <SafeAreaView>
  //     <Text style={styles.text}>Welcome Roomy!</Text>

  //       <Button
  //         title='Login'
  //         onPress={() => navigation.navigate('login')}
  //         style={styles.button}
  //       />
  //       <Button
  //         title='Register'
  //         onPress={() => navigation.navigate('register')}
  //         style={styles.button}
  //       />
  //     </SafeAreaView>
  //   </View>
  // )

  <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.text}>Welcome Roomy!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

export default LoginOptions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
    paddingTop:Platform.OS==='android' ? StatusBar.currentHeight : 0
  },
  button: {
    backgroundColor: '#007AFF',
    color: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  }
});