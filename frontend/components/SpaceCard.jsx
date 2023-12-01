import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IPADDRESS } from '@env'
import { UserType } from '../UserContext';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SpaceCard = ({ space,showOptions, onReload }) => {
    const navigation = useNavigation();
    const { userId, setUserId } = useContext(UserType);
    const iPAdress = IPADDRESS;
    const {
        images,
        title,
        numOfBedrooms,
        attributes,
        budget,
        availability,
        id
    } = space;

   

    const displayedAttributes = attributes?.slice(0, 3) || [];
    const remainingAttributesCount = (attributes || []).length - displayedAttributes.length;


    const [modalVisible, setModalVisible] = useState(false);
    
    const handleEdit = () => {
        setModalVisible(false);
        navigation.navigate('edit-listing');
    };
    const handleDelete = () => {
        setModalVisible(false);
      
        Alert.alert(
          'Confirm Deletion',
          'Are you sure you want to delete this listing?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              onPress: async () => {
                try {
                    const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
                  const response = await fetch(`http://${iPAdress}:6000/api/users/listings/${userId}/${space.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    },
                  });
      
                  if (!response.ok) {
                   
                    console.error('Failed to delete listing:', response.status, response.statusText);
                    return;
                  }
      

                  const responseData = await response.json();
                  console.log('Listing deleted successfully:', responseData);
                  onReload();
                  
                  // Add any additional logic you need after successful deletion
                } catch (error) {
                  // Handle fetch or other errors
                  console.error('Error deleting listing:', error);
                }
              },
            },
          ],
          { cancelable: true }
        );
      };

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                {images && images.length > 0 ? (
                    <Image source={{ uri: images[0] }} style={styles.image} />
                ) : (
                    <Text>No Image Available</Text>
                )}
                  {showOptions && (
                 <TouchableOpacity
                    style={styles.optionsButton}
                    onPress={() => setModalVisible(true)}
                >
                        <Text style={styles.optionsText}>.</Text>
                        <Text style={styles.optionsText}>.</Text>
                        <Text style={styles.optionsText}>.</Text>
                </TouchableOpacity>
                  )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.modalOption} onPress={handleEdit}>
                            <Text>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
                            <Text>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalOptionCancel}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text>{numOfBedrooms} Bedroom{numOfBedrooms !== 1 ? 's' : ''}</Text>
                <View style={styles.attributesContainer}>
                    {displayedAttributes.map((attribute, index) => (
                        <Text key={index} style={styles.attributeOptions}>{attribute}</Text>
                    ))}
                    {remainingAttributesCount > 0 && (
                        <Text style={styles.attributeNumber}>+{remainingAttributesCount}</Text>
                    )}
                </View>
                <View style={styles.infoContainer}>
                    <View>
                        <Text style={styles.budgetLabel}>Rent</Text>
                        <Text style={styles.budgetData}>{`$${budget}`}</Text>
                    </View>
                    <View>
                        <Text style={styles.availability}>Available</Text>
                        <Text style={styles.availability}>{availability}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'column',
        borderRadius: 8,
        width: '100%',
        height: 350,
        backgroundColor:'#FFF',
        marginBottom: 15,
        ...Platform.select({
            ios: {
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
            },
            android: {
              elevation: 4,
            },
          }),
    },
    optionsButton: {
        
        position: 'absolute',
        top: -15,
        right: 7,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        alignItems: 'center',
        
      
    },
    optionsText: {
        fontSize: 65,
        color: '#FFF',
        marginVertical: -30
    },
    imageContainer: {
        flex: 6,
    },
    image: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8

    },
    detailsContainer: {
        flex: 3,
        padding:10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    attributesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap:4
    },
    attributeOptions: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#FED6C4',
        borderRadius: 8,
        overflow: 'hidden',
        color:'#333333',

    },
    attributeNumber : {
        paddingVertical: 5,
        paddingHorizontal: 10,
        color:'#333333'
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    budget: {
        fontWeight: 'bold',
    },
    modalContainer: {
        position: 'absolute',
        top: 380,
        right: 17,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 5, 
        shadowColor: 'black',  
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems:'center'
    }
});

export default SpaceCard;