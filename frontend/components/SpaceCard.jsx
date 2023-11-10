import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const SpaceCard = ({ space }) => {
    const {
        images,
        title,
        numOfBedrooms,
        attributes,
        budget,
        availability,
    } = space;

    const displayedAttributes = attributes?.slice(0, 3) || [];
    const remainingAttributesCount = (attributes || []).length - displayedAttributes.length;

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                {images && images.length > 0 ? (
                    <Image source={{ uri: images[0] }} style={styles.image} />
                ) : (
                    <Text>No Image Available</Text>
                )}
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
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 8,
        width: 390,
        height: 350,
        
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
});

export default SpaceCard;