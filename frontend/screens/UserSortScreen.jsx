import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ImageBackground, Image } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native'

const UserSortScreen = ( ) => {
    const route = useRoute();
    const onApplySorting = route.params?.onApplySorting;
    const navigation = useNavigation();

  // console.log("ON APPLY",onApplySorting);
    // state to hold selected gender
    const [gender, setGender] = useState('');
    // state to hold selected budget
    const [budget, setBudget] = useState([0, 10000]);
    // console.log(budget);
    const [work, setWork] = useState('');

    const [pets, setPets] = useState('');

    const handleApplySorting = () => {
      // onApplySorting(gender, budget, work, pets);
      onApplySorting(gender, budget, work, pets);
      navigation.goBack();
    };

    const handleWorkSelection = (work) => {
      setWork(work);
      // console.log(work);
    };

    const handleGenderSelection = (gender) => {
        setGender(gender);
    };

    const handleBack = () => {
      navigation.goBack();
    }

    const handleSliderChange = (values) => {
        setBudgetRange(values);
        console.log(values);
        console.log(budgetRange);
    };

  return (
    <ImageBackground source={require('../assets/Filter_roommates.jpg')} style={styles.background}>

      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
          source={require('../assets/back.png')}
          style={styles.sortIcon}
        />
        <Text style={styles.sortText}>Filter & Sort</Text>
      </TouchableOpacity>

      <View style={styles.container}>

        <SafeAreaView>
            <ScrollView>
              <Text style={styles.heading}>Sort By</Text>
              <Text style={styles.heading}>Roommate gender</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                style={[
                    styles.option,
                    gender === 'Male' && styles.selectedOption,
                ]}
                onPress={() => handleGenderSelection('Male')}
                >
                <Text style={[styles.optionText, gender === 'Male' && styles.selectedOptionText]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[
                    styles.option,
                    gender === 'Female' && styles.selectedOption,
                ]}
                onPress={() => handleGenderSelection('Female')}
                >
                <Text style={[styles.optionText, gender === 'Female' && styles.selectedOptionText]}>Female</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[
                    styles.option,
                    gender === 'Other' && styles.selectedOption,
                ]}
                onPress={() => handleGenderSelection('Other')}
                >
                <Text style={[styles.optionText, gender === 'Other' && styles.selectedOptionText]}>Other</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.heading}>Budget range</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Max Budget"
                    onChangeText={(text) => {
                      const maxBudget = parseInt(text, 10);
                      setBudget([0, maxBudget]);
                    }}
                    style={styles.textInput}
                  />
              <Text style={styles.heading}>Profession</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    work === 'Working Professional' && styles.selectedOption,
                  ]}
                  onPress={() => handleWorkSelection('Working Professional')}
                  >
                  <Text style={[styles.optionText, work === 'Working Professional' && styles.selectedOptionText]}>Working Professional</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.option,
                    work === 'Unemployed' && styles.selectedOption,
                  ]}
                  onPress={() => handleWorkSelection('Unemployed')}
                  >
                  <Text style={[styles.optionText, work === 'Unemployed' && styles.selectedOptionText]}>Unemployed</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.option,
                    work === 'Student' && styles.selectedOption,
                  ]}
                  onPress={() => handleWorkSelection('Student')}
                  >
                  <Text style={[styles.optionText, work === 'Student' && styles.selectedOptionText]}>Student</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.option,
                    work === 'Business' && styles.selectedOption,
                  ]}
                  onPress={() => handleWorkSelection('Business')}
                  >
                  <Text style={[styles.optionText, work === 'Business' && styles.selectedOptionText]}>Business</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.option,
                    work === 'Other' && styles.selectedOption,
                  ]}
                  onPress={() => handleWorkSelection('Other')}
                  >
                  <Text style={[styles.optionText, work === 'Other' && styles.selectedOptionText]}>Other</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.heading}>Pets</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[
                    styles.option,
                    pets === 'Have' && styles.selectedOption,
                    ]}
                    onPress={() => setPets('Have')}
                >
                    <Text style={[styles.optionText, pets === 'Have' && styles.selectedOptionText]}>Have</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                    styles.option,
                    pets === 'Dont Have' && styles.selectedOption,
                    ]}
                    onPress={() => setPets('Dont Have')}
                >
                    <Text style={[styles.optionText, pets === 'Dont Have' && styles.selectedOptionText]}>Dont Have</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                    styles.option,
                    pets === 'May Have' && styles.selectedOption,
                    ]}
                    onPress={() => setPets('May Have')}
                >
                    <Text style={[styles.optionText, pets === 'May Have' && styles.selectedOptionText]}>May Have</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={handleApplySorting}
              >
                <Text style={styles.buttonText}>Apply all</Text>
              </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  )
}

export default UserSortScreen


const styles = StyleSheet.create({
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
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: '#fff',
    marginTop: "7%",
    borderRadius: 40
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#FF8F66',
    color:'#fff'
  },
  optionText: {
    color: 'black',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3E206D',
    color: '#fff',
    margin: 15,
    paddingVertical: 15,
    borderRadius: 13,
    width: "42%",
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 19,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center'
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    margin: 10,
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  dateTimePicker: {
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginBottom: 16, 
    alignSelf: 'center',
    
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  option: {
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    margin: 5,
  },
  optionText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontSize: 16,
  },
  selectedOptionText: {
    color: '#fff',
  }
});