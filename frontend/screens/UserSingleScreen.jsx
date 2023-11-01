import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const UserSingleScreen = ({ route   }) => {
    //user data
    const { user } = route.params;

    //function to calculate age
    const calculateAge = (dateOfBirth) => {
      const birthDate = new Date(dateOfBirth);
      const currentDate = new Date();
    
      const age = currentDate.getFullYear() - birthDate.getFullYear();
    
      // Check if the user's birthday has occurred this year
      if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }
    
      return age;
    };

    //storing user age in a variable
    const userAge = calculateAge(user.user.dateOfBirth);

  return (
    <View>
        <SafeAreaView>
            <ScrollView>
              <View style={styles.imageContainer}>
                <Image source={{ uri: user.user.profilePhoto[0]}} style={styles.image} />
                <Text style={styles.userName}>{user.user.name}, {userAge}</Text>
              </View>
              <View style={styles.CompatibilityContainer}>
                <Text style={styles.Compatibility}>Compatibility: {user.score}%</Text>
              </View>
              <Text style={styles.heading}>Desired room overview</Text>
              <Text style={styles.userScore}>Budget: ${user.user.budget} / month</Text>
              <Text style={styles.heading}>Bio</Text>
              <Text style={styles.userScore}>{user.user.bio}</Text>
              <Text style={styles.heading}>{user.user.name}'s Interests</Text>
              <View style={styles.optionContainer}>
                {user.user.interests.map((interest, index) => (
                    <Text style={styles.option} key={index}>{interest}</Text>
                ))}
              </View>
              <Text style={styles.heading}>{user.user.name}'s Traits</Text>
              <View style={styles.optionContainer}>
                {user.user.traits.map((trait, index) => (
                    <Text style={styles.option} key={index}>{trait}</Text>
                ))}
              </View>

              <View>
                <Text style={styles.heading}>{user.user.name}'s listings</Text>
                  {user.user.listMySpace.description ? (
                    <View>
                      <Image source={{ uri: user.user.listMySpace.images[0]}} style={styles.image} />
                      <Text style={styles.title}>{user.user.listMySpace.title}</Text>
                      <Text style={styles.description}>{user.user.listMySpace.description}</Text>
                      <Text style={styles.rent}>Rent</Text>
                      <Text style={styles.budget}>{user.user.listMySpace.budget} cad/month</Text>
                    </View>
                  ) : (
                    <Text>{user.user.name} has not listed any spaces yet.</Text>
                  )}
              </View>

            </ScrollView>
        </SafeAreaView>
    </View>
  )
}

export default UserSingleScreen

const styles = StyleSheet.create({
    containerMain: {
      flex: 1,
      padding: 30,
    },
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },
    title: {
      marginVertical: 10,
      fontSize: 18,
    },
    description: {
      marginVertical: 10,
      fontSize: 16,
    },
    rent: {
      marginVertical: 10,
      fontSize: 16,
      color: '#797979',
    },
    budget: {
      fontSize: 19,
    },
    optionContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    option: {
      borderWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      margin: 5,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 8,
    },
    userInfo: {
      marginLeft: 10,
    },
    userName: {
      fontSize: 25,
      fontWeight: 'bold',
      position: 'absolute',
      bottom: 20,
      left: 10,
      color: '#fff',

    },
    Compatibility: {
      fontSize: 16,
      fontWeight: 'bold',
      backgroundColor: '#FF8F66',
      color: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 10,
    },
    CompatibilityContainer: {
      position: 'absolute',
      top: 170,
      right: 25,
    },
    userScore: {
      fontSize: 16,
    },
    imageContainer: {
      position: 'relative',
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
});