import React  from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserCard = ({ userData }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('userSingleScreen', { user: userData });
  }

  return (
    <View style={styles.cardContainer}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View>
          <Image source={{ uri: userData.user.profilePhoto[0]}} style={styles.image} />
          <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.user.name}</Text>
              <Text style={styles.userScore}>{userData.score}%</Text>
              <Text style={styles.userScore}>Budget: ${userData.user.budget} / month</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#333',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userScore: {
    fontSize: 16,
    marginBottom: 10
  },
});

export default UserCard;
