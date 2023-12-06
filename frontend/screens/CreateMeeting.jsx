import {  useFonts, 
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import React, { Fragment, useEffect, useState, useContext } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import useKeyboardHeight from '../hooks/useKeyboardHeight';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: vw } = Dimensions.get('window');

const CreateMeeting = ({ route }) => {
    const navigation = useNavigation();

  const keyboardHeight = useKeyboardHeight();

  const [selectedDay, setSelectedDay] = useState({
    [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format(
      'DD'
    )}`]: {
      selected: true,
      selectedColor: '#FF8F66'
    }
  });
  const [currentDay, setCurrentDay] = useState(moment().format());
  const [taskText, setTaskText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [visibleHeight, setVisibleHeight] = useState(
    Dimensions.get('window').height
  );
  const [alarmTime, setAlarmTime] = useState(moment().format());
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
    const recepientId = route.params?.recepientId;
    const { userId, setUserId } = useContext(UserType);
    let ipAdress = IPADDRESS;

  useEffect(() => {
    if (keyboardHeight > 0) {
      setVisibleHeight(Dimensions.get('window').height - keyboardHeight);
    } else if (keyboardHeight === 0) {
      setVisibleHeight(Dimensions.get('window').height);
    }
  }, [keyboardHeight]);

  const showDateTimePicker = () => setDateTimePickerVisible(true);

  const hideDateTimePicker = () => setDateTimePickerVisible(false);

  let idCounter = new Date().getTime();

  function generateUniqueId() {
    return (idCounter++).toString();
  }

  const handleSend = async (creatTodo) => {

    const temp = recepientId;
    const tempCreateTodo = creatTodo;
    try {
        const formData = new FormData();
        formData.append("senderId", userId);
        formData.append("recepientId", temp);
        formData.append("creatTodo", tempCreateTodo);
    

          function getFormDataValue(formData, fieldName) {
            for (const [key, value] of formData._parts) {
              if (key === fieldName) {
                return value;
              }
            }
            return null;
          }
          const senderId = getFormDataValue(formData, "senderId");
          const recepientId = getFormDataValue(formData, "recepientId");
          const creatTodo = getFormDataValue(formData, "creatTodo");

          const data = {
            senderId: senderId,
            recepientId: recepientId,
            creatTodo: creatTodo
          };

          const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
        const response = await fetch(`http://${ipAdress}:6000/api/users/meetings`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log("Response OK");
            const message = "name has scheduled a meeting with you"
            handleSendNotification(userId, temp, message);
        }
    }
    catch (error) {
        console.log("Error in sending meetings", error);
    }
}
  
const handleSendNotification = async (currentUserId, selectedUserId, message) => {
  try {
        const data = {
          senderId: currentUserId,
          recepientId: selectedUserId,
          message: message
        };

        const token = await AsyncStorage.getItem('jwt');
          if (!token) {
            // Handle the case where the token is not available
            console.error('No authentication token available.');
            return;
          }
      const response = await fetch(`http://${ipAdress}:6000/api/users/request-notification`, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data)
      })

      if (response.ok) {
        console.log("Request notification sent successfully.");
      }
  }
  catch (error) {
      console.log("Error in sending notification", error);
  }
}


  const handleCreateEventData = async (createEventId) => {
    const creatTodo = {
      key: generateUniqueId(),
      date: `${moment(currentDay).format('YYYY')}-${moment(currentDay).format(
        'MM'
      )}-${moment(currentDay).format('DD')}`,
      todoList: [
        {
          key: generateUniqueId(),
          title: taskText,
          notes: notesText,
          alarm: {
            time: alarmTime,
          },
          color: `rgb(${Math.floor(
            Math.random() * Math.floor(256)
          )},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(
            Math.random() * Math.floor(256)
          )})`
        }
      ],
      markedDot: {
        date: currentDay,
        dots: [
          {
            key: generateUniqueId(),
            color: '#FF8F66',
            selectedDotColor: '#FF8F66'
          }
        ]
      }
    };

    await handleSend(creatTodo);
    navigation.goBack();
  };

  const handleDatePicked = (date) => {
    const selectedDatePicked = currentDay;
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    const newModifiedDay = moment(selectedDatePicked).hour(hour).minute(minute);
    setAlarmTime(newModifiedDay);
    hideDateTimePicker();
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
      <DateTimePicker
        isVisible={isDateTimePickerVisible}
        onConfirm={handleDatePicked}
        onCancel={hideDateTimePicker}
        mode="time"
        date={new Date()}
        isDarkModeEnabled
      />
     
      <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      extraScrollHeight={Platform.OS === 'ios' ? 50 : 0}
      enableOnAndroid={true}
    >
        <View>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          >
          
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backIconContainer}
                >
                <Image
                  style={styles.sortIcon}
                  source={require('../assets/back.png')}
                  resizeMode="contain"
                />
                <Text style={styles.sortText}>New Meeting</Text>
              </TouchableOpacity>

            <View style={styles.calenderContainer}>
              <CalendarList
                style={{
                  width: 350,
                  height: 350,
                  borderRadius: 20,
                }}
                current={currentDay}
                minDate={moment().format()}
                horizontal
                pastScrollRange={0}
                pagingEnabled
                calendarWidth={350}
                onDayPress={(day) => {
                  setSelectedDay({
                    [day.dateString]: {
                      selected: true,
                      selectedColor: '#FF8F66'
                    }
                  });
                  setCurrentDay(day.dateString);
                  setAlarmTime(day.dateString);
                }}
                monthFormat="yyyy MMMM"
                hideArrows
                markingType="custom"
                theme={{
                  selectedDayBackgroundColor: '#FF8F66',
                  selectedDayTextColor: 'white',
                  todayTextColor: 'black',
                  textDisabledColor: '#d9dbe0'
                }}
                markedDates={selectedDay}
              />
            </View>
            <View style={styles.taskContainer}>
              <TextInput
                style={styles.title}
                onChangeText={setTaskText}
                value={taskText}
                placeholder="What is meeting about?"
              />
              <View style={styles.notesContent} />
              <View>
                <Text style={styles.notes}>Location</Text>
                <TextInput
                  style={{
                    height: 25,
                    fontSize: 19,
                    marginTop: 3,
                    fontFamily: 'Outfit_400Regular',
                  }}
                  onChangeText={setNotesText}
                  value={notesText}
                  placeholder="Location you want to meet"
                />
              </View>
              <View style={styles.separator} />
              <View>
                <Text
                  style={{
                    color: '#9CAAC4',
                    fontSize: 16,
                    fontWeight: '600',
                    fontFamily: 'Outfit_600SemiBold',
                  }}
                >
                  Time
                </Text>
                <TouchableOpacity
                  onPress={() => showDateTimePicker()}
                  style={{
                    height: 25,
                    marginTop: 3
                  }}
                >
                  <Text style={{ fontSize: 19 }}>
                    {moment(alarmTime).format('h:mm A')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
            </View>
            <TouchableOpacity
              disabled={taskText === ''}
              style={[
                styles.createTaskButton,
                {
                  backgroundColor:
                    taskText === '' ? 'rgba(62,32,109,0.5)' : '#3E206D'
                }
              ]}
              onPress={async () => {
                  handleCreateEventData();
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#fff',
                  ontFamily: 'Outfit_600SemiBold',
                }}
              >
                Schedule Meeting
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Fragment>
  );
}

export default CreateMeeting


const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover'
  },
  createTaskButton: {
    width: 252,
    height: 48,
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 5,
    justifyContent: 'center',
  },
  backIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: "3%",
    marginLeft: "2%",
    marginBottom: "1%",
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
  separator: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 20
  },
  notes: {
    color: '#9CAAC4',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Outfit_600SemiBold',
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
    fontSize: 19,
    fontFamily: 'Outfit_400Regular',
  },
  taskContainer: {
    height: 300,
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
    shadowOpacity: 0.2,
    elevation: 5,
    padding: 38,
  },
  calenderContainer: {
    marginTop: 30,
    marginBottom: 30,
    width: 350,
    height: 350,
    alignSelf: 'center',
    backgroundColor: "rgba(255,248,246, 0.9)",
  },
  newTask: {
    alignSelf: 'center',
    fontSize: 20,
    width: 120,
    height: 25,
    textAlign: 'center'
  },
  backButton: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255,248,246, 0.9)",
  }
});
