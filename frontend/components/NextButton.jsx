import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

const NextButton = ({ onPress, buttonText }) => {
  return (
    <View style={styles.btnContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
        <Image
            source={require('../assets/Horizontal.png')}
            style={styles.nextIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    btnContainer : {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "60%",
    },
    button: {
        backgroundColor: '#51367B',
        color: '#fff',
        marginTop: 30,
        paddingHorizontal: 60,
        paddingVertical: 17,
        borderRadius: 8,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: "400",
        fontFamily: 'Outfit_400Regular',
    },
    nextIcon: {
        width: 23,
        height: 23,
    }
});

export default NextButton;
