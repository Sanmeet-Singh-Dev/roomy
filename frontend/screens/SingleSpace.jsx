import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet , TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SliderBox } from 'react-native-image-slider-box';
import { useNavigation } from '@react-navigation/native';
import { IPADDRESS } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserType } from '../UserContext';

const SpaceDetails = ({ route }) => {
  const navigation = useNavigation();
  const { space } = route.params;
  let iPAdress = IPADDRESS;
  let user;
  const [userData, setUserData] = useState({});
  const [ userFriends , setUserFriends ] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  

  const renderImageCarousel = () => (
 <SliderBox images={space.images} style={styles.image} />
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        if (!token) {
          // Handle the case where the token is not available
          console.error('No authentication token available.');
          return;
        }
        const response = await fetch(`https://roomyapp.ca/api/api/users/users/${space.user}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token as a bearer token
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUserData(userData);
        // console.log("PROFILEPIC",userData.profilePhoto)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserFriends = async () => {
        try{
          const token = await AsyncStorage.getItem('jwt');
          if (!token) {
           console.error('No authentication token available.');
            return;
          }
            const response = await fetch(`https://roomyapp.ca/api/api/users/friends/${userId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token as a bearer token
              }
            });
            const data = await response.json();
            if(response.ok){
                setUserFriends(data);
            }
            else {
                console.log("error ", response.status);
            }
        }catch(error){
        console.log("error ", error);
    }
    }

    fetchUserFriends();
},[userFriends]);

  const onViewProfile = ()=>{
    user = {
      score: userData.__v,
      user: userData
    }
   
    navigation.navigate('userSingleScreen', { user: user });
  }

  const handleBack = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.mainContainer}>
      <ImageBackground source={require('../assets/userSingleScreen.jpg')} style={styles.background}>
      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
          source={require('../assets/back.png')}
          style={styles.sortIcon}
        />
        <Text style={styles.sortText}>Room Listing</Text>
      </TouchableOpacity>

      <SafeAreaView>
        <ScrollView>
          <View style={styles.card}>
            {renderImageCarousel()}
            <Text style={styles.title}>{space.title}</Text>
            <Text style={styles.budget}>${space.budget}/Month</Text>
            <View style={styles.locationContainer}>
              <Image
                source={require('../assets/location.png')}
                style={styles.icon}
              />
              <Text style={styles.location}>
                {space.fullAddress || 'Address not available'}
              </Text>
            </View>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.descriptionText}> {space.description}</Text>
            <Text style={styles.availability}>Availability</Text>
            <View style={styles.locationContainer}>
            <Image
                source={require('../assets/calender.png')}
                style={styles.calendarIcon}
              />
            <Text style={styles.location}>
              {space.availability || 'N/A'}
            </Text>
            </View>
      
            <Text style={styles.petFriendly}>Pet Friendly</Text>
            <View style={styles.customOptionContainer}>
            <Text style={styles.customOption}>
              {space.petFriendly || 'N/A'}
            </Text>
            </View>
            <Text style={styles.roomSuitability}>Room Suitability</Text>
            <View style={styles.customOptionContainer}>
            <Text style={styles.customOption}>
              {space.roomSuitability || 'N/A'}
            </Text>
            </View>
            <Text style={styles.furnished}>Furnished</Text>
            <View style={styles.customOptionContainer}>
            <Text style={styles.customOption}>
              {space.furnished || 'N/A'}
            </Text>
            </View>
            <Text style={styles.numOfBedrooms}>Number of Bedrooms</Text>
            <View style={styles.customOptionContainer}>
            <Text style={styles.customOption}>
              {space.numOfBedrooms || 'N/A'}
            </Text>
            </View>
            <Text style={styles.numOfBathroom}>Number of Bathrooms</Text>
            <View style={styles.customOptionContainer}>
              <Text style={styles.customOption}>
              {space.numOfBathroom || 'N/A'}
              </Text>
            </View>
              <Text style={styles.description}>Attributes:</Text>
            <View style={styles.customOptionContainer}>
              {space.attributes.map((attribute, index) => (
                <Text style={styles.customOption} key={index}>
                  {attribute}
                </Text>
              ))}
            </View>
       {userData.profilePhoto ? (
              <View style={styles.sellerCard}>
                <Text style={styles.sellerTitle}>Seller Description</Text>
                <View style={styles.sellerInfo}>
                  <View style={styles.profileContainer}>
                  { userFriends.includes(userData._id) ? (
                    <Image
                      source={{
                        uri: userData.profilePhoto[0] || 'Seller Profile Pic',
                      }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: userData.profilePhoto[0] || 'Seller Profile Pic',
                      }}
                      style={styles.profileImage} blurRadius={20}
                    />
                  ) }
                  </View>
                  <View style={styles.sellerDetails}>
                    <Text style={styles.userName}>{userData.name || 'User Name'}</Text>
                    <TouchableOpacity onPress={onViewProfile}>
                      <Text style={styles.viewProfileButton}>View Profile</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: "15%",
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 30,
    margin:5,
    marginHorizontal: 0,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    paddingBottom: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  backIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: "15%",
    marginLeft: "2%",
    marginBottom: "1%",
  },
  sortIcon: {
    width: 30,
    height: 30,
    margin: 5,
  },
  sortText: {
    fontSize: 17,
    fontWeight: "500",
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 15,
    height: 28,
  },
  calendarIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight:"500"
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 20,
  },
  budget: {
    fontSize: 16,
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    marginLeft: 5,
  },
  numOfBedrooms: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight:"500"
  },
  numOfBathroom: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight:"500"
  },
  availability: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight:"500"
  },
  roomSuitability: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight:"500"
  },
  petFriendly: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight:"500"
  },
  furnished: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight:"500"
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  image: {
    width: '92%',
    height: 308,
    marginRight: 8,
    borderRadius: 20,
  },
  customOptionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    borderRadius: 20,
    marginBottom:25,
    gap:10

  },
  customOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#FF8F66',
    borderRadius: 7,
    overflow: 'hidden',
    color:'#FFFFFF'
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userProfilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  sellerCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 15,
  },
  sellerTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40, //
  },
  sellerDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight:"bold"
  },
  viewProfileButton: {
    color: '#FF8F66',
    fontSize: 16,
    borderColor: "#FF8F66",
    borderWidth: 1,
    borderRadius: 20,
    textAlign:"center",
    width:150,
    paddingVertical:7
  },
});

export default SpaceDetails;
