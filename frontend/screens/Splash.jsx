import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


const Splash = () => {
    const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('loginOptions');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <ImageBackground
      source={require('../assets/Splash-Screen.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.centerContainer}>
        <Image
          source={require('../assets/roomy.png')}
          style={styles.icon}
        />
        <Text style={styles.text}>Connecting Homes, Connecting Lives</Text>
      </View>
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 100, 
    height: 120, 
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: 400,
    color: '#333333',
  },
});
