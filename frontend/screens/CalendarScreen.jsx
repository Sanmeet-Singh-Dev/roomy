import {  useFonts, 
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import React, { Fragment, useEffect, useState , useContext} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  ImageBackground
} from 'react-native';
import moment from 'moment';

import CalendarStrip from 'react-native-calendar-strip';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Task from '../components/Task';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation , useRoute} from '@react-navigation/native';
import { IPADDRESS } from "@env"
import { UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const datesWhitelist = [
  {
    start: moment(),
    end: moment().add(365, 'days') // total 4 days enabled
  }
];

const CalendarScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { recepientId } = route.params;

  const { userId, setUserId } = useContext(UserType);
  const [meetings, setMeetings] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [markedDate, setMarkedDate] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    `${moment().format('YYYY')}-${moment().format('MM')}-${moment().format(
      'DD'
    )}`
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  let ipAdress = IPADDRESS;

  const fetchMeetings = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
        const response = await fetch(`https://roomyapp.ca/api/api/users/meetings/${userId}/${recepientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token as a bearer token
          }
        })
        
        const data = await response.json();

        const createTodoList = [];

data.forEach((item) => {
    if (item.creatTodo) {
        createTodoList.push(item.creatTodo);
    }
});

        if (response.ok) {
            setMeetings(createTodoList);
        }
        else {
            console.log("error showing meetings", response.status.meeting);
        }
    }
    catch (error) {
        console.log("Error fetching meetings", error)
    }
}

useEffect(() => {
    fetchMeetings();
    updateCurrentTask(currentDate);
}, [meetings])


  const updateSelectedTask = async ({date, meetings}) => {

    try {
      const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
        const response = await fetch(`https://roomyapp.ca/api/api/users/updateMeetings`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ meetings: meetings, date: date })
        });

        if (response.ok) {
            fetchMeetings();
        }
        else {
            console.log("Error in updating meetings", response.status);
        }
    } catch (error) {
        console.log("Error in updating meetings", error);
    }
    
  }

  const deleteSelectedTask = async ({date, meetings}) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        // Handle the case where the token is not available
        console.error('No authentication token available.');
        return;
      }
        const response = await fetch(`https://roomyapp.ca/api/api/users/deleteMeetings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ meetings: meetings, date: date })
        });

        if (response.ok) {
            fetchMeetings();
        }
        else {
            console.log("Error in deleting meetings", response.status);
        }
    } catch (error) {
        console.log("Error in deleting meetings", error);
    }
  }

  const handleModalVisible = () => {
    setModalVisible(!isModalVisible);
  };

  const updateCurrentTask = async (currentDate) => {
    try {
      if (meetings !== [] && meetings) {
        const markDot = meetings.map((item) => item.markedDot);
        const todoLists = meetings.filter((item) => {
          if (currentDate === item.date) {
            return true;
          }
          return false;
        });
        setMarkedDate(markDot);
        if (todoLists.length !== 0) {
            const accumulatedTodoList = [];

  for (let i = 0; i < todoLists.length; i++) {
    accumulatedTodoList.push(...todoLists[i].todoList);
  }

  setTodoList(accumulatedTodoList);
        } else {
          setTodoList([]);
        }
      }
    } catch (error) {
      console.log('updateCurrentTask', error.message);
    }
  };

  const showDateTimePicker = () => setDateTimePickerVisible(true);

  const hideDateTimePicker = () => setDateTimePickerVisible(false);

  const handleDatePicked = (date) => {
    let prevSelectedTask = JSON.parse(JSON.stringify(selectedTask));
    const selectedDatePicked = prevSelectedTask.alarm.time;
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    let newModifiedDay = moment(selectedDatePicked).hour(hour).minute(minute);
    prevSelectedTask.alarm.time = newModifiedDay;
    setSelectedTask(prevSelectedTask);
    hideDateTimePicker();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  let [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });
  
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Fragment>
      <ImageBackground source={require('../assets/calender.jpg')} style={styles.background}>

      <TouchableOpacity style={styles.backIconContainer} onPress={handleBack}>
        <Image
        source={require('../assets/back.png')}
        style={styles.sortIcon}
        />
        <Text style={styles.sortText}>Meetings</Text>
      </TouchableOpacity>

        {
        selectedTask !== null && (
          <Task {...{ setModalVisible, isModalVisible }}>
            <DateTimePicker
              isVisible={isDateTimePickerVisible}
              onConfirm={handleDatePicked}
              onCancel={hideDateTimePicker}
              mode="time"
              date={new Date()}
              isDarkModeEnabled
            />
            <View style={styles.taskContainer}>
              <TextInput
                style={styles.title}
                onChangeText={(text) => {
                  let prevSelectedTask = JSON.parse(JSON.stringify(selectedTask));
                  prevSelectedTask.title = text;
                  setSelectedTask(prevSelectedTask);
                }}
                value={selectedTask.title}
                placeholder="What is meeting about?"
              />
              <View style={styles.notesContent} />
              <View>
                <Text
                  style={{
                    color: '#9CAAC4',
                    fontSize: 16,
                    fontWeight: '600'
                  }}
                >
                  Location
                </Text>
                <TextInput
                  style={{
                    height: 25,
                    fontSize: 19,
                    marginTop: 3
                  }}
                  onChangeText={(text) => {
                    let prevSelectedTask = JSON.parse(
                      JSON.stringify(selectedTask)
                    );
                    prevSelectedTask.notes = text;
                    setSelectedTask(prevSelectedTask);
                  }}
                  value={selectedTask.notes}
                  placeholder="Enter Location"
                />
              </View>
              <View style={styles.separator} />
              <View>
                <Text
                  style={{
                    color: '#9CAAC4',
                    fontSize: 16,
                    fontWeight: '600'
                  }}
                >
                  Times
                </Text>
                <TouchableOpacity
                  onPress={() => showDateTimePicker()}
                  style={{
                    height: 25,
                    marginTop: 3
                  }}
                >
                  <Text style={{ fontSize: 19 }}>
                    {moment(selectedTask?.alarm?.time || moment()).format(
                      'h:mm A'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TouchableOpacity
                  onPress={async () => {
                    handleModalVisible();
                    await updateSelectedTask({
                      date: currentDate,
                      meetings: selectedTask
                    });
                    updateCurrentTask(currentDate);
                  }}
                  style={styles.updateButton}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: '#fff'
                    }}
                  >
                    UPDATE
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    handleModalVisible();
                    await deleteSelectedTask({
                      date: currentDate,
                      meetings: selectedTask
                    });
                    updateCurrentTask(currentDate);
                  }}
                  style={styles.deleteButton}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: '#fff'
                    }}
                  >
                    DELETE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Task>
        )}
        <SafeAreaView
          style={{
            flex:1,
            backgroundColor: "rgba(255,248,246, 0.9)",
            marginTop: "1%",
            borderRadius: 40,
          }}
        >
          <ImageBackground source={require('../assets/Account.jpg')} style={styles.background}></ImageBackground>
          <CalendarStrip
            calendarAnimation={{ type: 'sequence', duration: 30 }}
            daySelectionAnimation={{
              type: 'background',
              duration: 200
            }}
            style={{
              height: 150,
              paddingTop: 20,
              paddingBottom: 20,
              background: "url('../assets/Account.jpg') center / contain no-repeat",
              // backgroundColor: 'white',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
            calendarHeaderStyle={{ color: '#000000' }}
            dateNumberStyle={{ color: '#000000', paddingTop: 10 }}
            dateNameStyle={{ color: '#BBBBBB' }}
            highlightDateNumberStyle={{
              color: '#fff',
              backgroundColor: '#FF8F66',
              marginTop: 10,
              height: 35,
              width: 35,
              textAlign: 'center',
              borderRadius: 17.5,
              overflow: 'hidden',
              paddingTop: 6,
              fontWeight: '400',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            highlightDateNameStyle={{ color: '#2E66E7' }}
            disabledDateNameStyle={{ color: 'grey' }}
            disabledDateNumberStyle={{ color: 'grey', paddingTop: 10 }}
            datesWhitelist={datesWhitelist}
            iconLeft={require('../assets/left-arrow.png')}
            iconRight={require('../assets/right-arrow.png')}
            iconContainer={{ flex: 0.1 }}
            markedDates={markedDate}
            selectedDate={currentDate}
            onDateSelected={(date) => {
              const selectedDate = `${moment(date).format('YYYY')}-${moment(
                date
              ).format('MM')}-${moment(date).format('DD')}`;
              updateCurrentTask(selectedDate);
              setCurrentDate(selectedDate);
            }}
          />
          <TouchableOpacity
              onPress={() =>
                navigation.navigate('CreateMeeting', {
                  recepientId: recepientId
                })
            }
            style={styles.viewTask}
          >
            <Image
              source={require('../assets/plus.png')}
              style={{
                height: 30,
                width: 30
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height - 170,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 20
              }}
            >
              { todoList ? (
                todoList.map((item) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTask(item);
                      setModalVisible(true);
                    }}
                    key={item.key}
                    style={styles.taskListContent}
                  >
                    <View
                      style={{
                        marginLeft: 13
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: item.color,
                            marginRight: 8
                          }}
                        />
                        <Text
                          style={{
                            color: '#554A4C',
                            fontSize: 20,
                            fontWeight: '700'
                          }}
                        >
                          {item.title}
                        </Text>
                      </View>
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: 20
                          }}
                        >
                          <Text
                            style={{
                              color: '#BBBBBB',
                              fontSize: 14
                            }}
                          >
                            {item.notes}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View>
                       <Text
                            style={{
                              color: '#BBBBBB',
                              fontSize: 14
                            }}
                          >
                            {moment(item.alarm.time || moment()).format(
                        'h:mm A'
                      )}
                          </Text>
                    </View>
                    <View
                      style={{
                        height: 80,
                        width: 5,
                        backgroundColor: item.color,
                        borderRadius: 5
                      }}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <View>
              <ImageBackground source={require('../assets/Account.jpg')} style={styles.background}></ImageBackground>
              <Text> No Meetings Scheduled </Text>
              </View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </Fragment>
  );
}

export default CalendarScreen

const styles = StyleSheet.create({
  background: {
    flex: 10,
    resizeMode: 'cover'
  },
  backIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: "15%",
    marginLeft: "2%",
    marginBottom: "5%",
},
sortIcon: {
    width: 30,
    height: 30,
    margin: 5,
},
sortText: {
  fontSize: 16,
  fontFamily: 'Outfit_600SemiBold',
},
  taskListContent: {
    height: 100,
    width: 327,
    alignSelf: 'center',
    borderRadius: 10,
    shadowColor: '#2E66E7',
    backgroundColor: '#ffffff',
    marginTop: 10,
    marginBottom: 10,
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  viewTask: {
    position: 'absolute',
    bottom: 40,
    right: 17,
    height: 60,
    width: 60,
    backgroundColor: '#51367B',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#BB97DB',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 5,
    zIndex: 999
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    width: 100,
    height: 38,
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 5,
    justifyContent: 'center'
  },
  updateButton: {
    backgroundColor: '#2E66E7',
    width: 100,
    height: 38,
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 5,
    justifyContent: 'center',
    marginRight: 20
  },
  separator: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 20
  },
  notesContent: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 20
  },
  learn: {
    height: 23,
    width: 51,
    backgroundColor: '#F8D557',
    justifyContent: 'center',
    borderRadius: 5
  },
  design: {
    height: 23,
    width: 59,
    backgroundColor: '#62CCFB',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7
  },
  readBook: {
    height: 23,
    width: 83,
    backgroundColor: '#4CD565',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7
  },
  title: {
    height: 25,
    borderColor: '#5DD976',
    borderLeftWidth: 1,
    paddingLeft: 8,
    fontSize: 19
  },
  taskContainer: {
    height: 420,
    width: 327,
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#2E66E7',
    backgroundColor: '#ffffff',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowRadius: 20,
    shadowOpacity: 0.1,
    elevation: 5,
    padding: 30,
    paddingTop: 50,
  }
});