import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native'
// import RangeSlider from 'react-native-range-slider';

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

    const handleSliderChange = (values) => {
        setBudgetRange(values);
        console.log(values);
        console.log(budgetRange);
    };

  return (
    <View>
      <SafeAreaView>
          <ScrollView>
            <Text>Sort By</Text>

            <Text>Roommate gender</Text>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
              style={[
                  styles.option,
                  gender === 'Male' && styles.selectedOption,
              ]}
              onPress={() => handleGenderSelection('Male')}
              >
              <Text style={styles.optionText}>Male</Text>
              </TouchableOpacity>

              <TouchableOpacity
              style={[
                  styles.option,
                  gender === 'Female' && styles.selectedOption,
              ]}
              onPress={() => handleGenderSelection('Female')}
              >
              <Text style={styles.optionText}>Female</Text>
              </TouchableOpacity>

              <TouchableOpacity
              style={[
                  styles.option,
                  gender === 'Other' && styles.selectedOption,
              ]}
              onPress={() => handleGenderSelection('Other')}
              >
              <Text style={styles.optionText}>Other</Text>
              </TouchableOpacity>
            </View>

            {/* Budget Slider */}
            <Text>Budget range</Text>
            {/* <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={budgetRange[1]}
                step={100}
                values={budgetRange}
                onValuesChange={handleSliderChange}
            />
              <Text>
                  Current Range: {budgetRange[0]} - {budgetRange[1]}
              </Text> */}

                {/* <RangeSlider
                    style={styles.rangeSlider}
                    min={0}
                    max={5000}
                    step={100}
                    low={budgetRange[0]}
                    high={budgetRange[1]}
                    selectionColor="#007AFF" // Color of selected range
                    blankColor="#D3D3D3" // Color of unselected range
                    onValueChanged={handleBudgetChange}
                />
                <Text>Min Budget: {budgetRange[0]}</Text>
                <Text>Max Budget: {budgetRange[1]}</Text> */}

                <TextInput
                  keyboardType="numeric"
                  placeholder="Max Budget"
                  onChangeText={(text) => {
                    const maxBudget = parseInt(text, 10);
                    setBudget([0, maxBudget]);
                  }}
                  style={styles.textInput}
                />

            <View style={styles.optionsContainer}>
            <Text>Profession</Text>
              <TouchableOpacity
                style={[
                  styles.option,
                  work === 'Working Professional' && styles.selectedOption,
                ]}
                onPress={() => handleWorkSelection('Working Professional')}
                >
                <Text style={styles.optionText}>Working Professional</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  work === 'Unemployed' && styles.selectedOption,
                ]}
                onPress={() => handleWorkSelection('Unemployed')}
                >
                <Text style={styles.optionText}>Unemployed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  work === 'Student' && styles.selectedOption,
                ]}
                onPress={() => handleWorkSelection('Student')}
                >
                <Text style={styles.optionText}>Student</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  work === 'Business' && styles.selectedOption,
                ]}
                onPress={() => handleWorkSelection('Business')}
                >
                <Text style={styles.optionText}>Business</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  work === 'Other' && styles.selectedOption,
                ]}
                onPress={() => handleWorkSelection('Other')}
                >
                <Text style={styles.optionText}>Other</Text>
              </TouchableOpacity>

            </View>

            <View style={styles.optionsContainer}>
              <Text>Pets</Text>
              <TouchableOpacity
                  style={[
                  styles.option,
                  pets === 'Have' && styles.selectedOption,
                  ]}
                  onPress={() => setPets('Have')}
              >
                  <Text style={styles.optionText}>Have</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[
                  styles.option,
                  pets === 'Dont Have' && styles.selectedOption,
                  ]}
                  onPress={() => setPets('Dont Have')}
              >
                  <Text style={styles.optionText}>Dont Have</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[
                  styles.option,
                  pets === 'May Have' && styles.selectedOption,
                  ]}
                  onPress={() => setPets('May Have')}
              >
                  <Text style={styles.optionText}>May Have</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleApplySorting}
            >
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>

          </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default UserSortScreen


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 30,
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
      backgroundColor: 'blue', // Change to your desired highlight color
      borderColor: 'blue',
      color:'#fff' // Change to your desired highlight color
    },
    optionText: {
      color: 'black', // Change to your desired text color
      textAlign: 'center',
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 17,
      fontWeight: 'bold'
    },
    button: {
      backgroundColor: '#007AFF',
      color: '#fff',
      margin: 10,
      padding: 10,
      borderRadius: 8,
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
      marginBottom: 16,
      margin: 10,
      padding: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
      marginRight: 10,
    },
    dateTimePicker: {
      // backgroundColor: '#fff',
      borderColor: 'gray',
      // borderWidth: 1, 
      // borderRadius: 8, 
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
      justifyContent: 'space-between',
      marginTop: 10,
    },
    option: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
    },
    selectedOption: {
      backgroundColor: 'blue', // Change to your desired highlight color
      borderColor: 'blue', // Change to your desired highlight color
    },
    optionText: {
      color: 'black', // Change to your desired text color
      textAlign: 'center',
    },
});