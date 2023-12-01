import React from 'react'
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const ProfileCreated = () => {
    const navigation = useNavigation();
    const handleNavigation = () => {
        navigation.navigate('home');
    };

  return (
    <ImageBackground source={require('../assets/ProfileCreate.jpg')} style={styles.background}>
        <View>
            <SafeAreaView>
                <View style={styles.container}>
                    <Image
                        source={require('../assets/check.png')}
                        style={styles.checkIcon}
                    />
                    <Text style={styles.headingText}>Congratulations!</Text>
                    <Text style={styles.descText}>Your Profile has been successfully created. Enjoy a tailored experience with us based on your preferences.</Text>
                    <TouchableOpacity style={styles.button} onPress={handleNavigation}>
                        <Image
                          source={require('../assets/Horizontal.png')}
                          style={styles.btnIcon}
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    </ImageBackground>
  )
}

export default ProfileCreated

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
      },
      checkIcon: {
        width: 80,
        height: 80,
        marginTop: 100,
        alignSelf: 'center',
      },
      container: {
        marginTop: 100,
        marginHorizontal: "13%",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
      },
      headingText: {
        color: "#51367B",
        fontSize: 30,
        fontWeight: "700",
      },
      descText: {
        color: "#000000",
        fontSize: 18,
        fontWeight: "500",
        lineHeight: 28,
        textAlign: 'center',
      },
      button: {
        backgroundColor: "#51367B",
        borderRadius: 10,
        paddingHorizontal: 17,
        paddingVertical: 10,
        marginTop: 25,
      },
      btnIcon: {
        width: 50,
        height: 50,
      }
})