import React, { Fragment, useEffect, useState, useContext } from 'react';
import {
  Alert,
  Dimensions,
  Image,
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
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { v4 as uuidv4 } from 'uuid';
import useKeyboardHeight from '../hooks/useKeyboardHeight';
import useStore from '../store/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"

const { width: vw } = Dimensions.get('window');
// moment().format('YYYY/MM/DD')

const styles = StyleSheet.create({
  createTaskButton: {
    width: 252,
    height: 48,
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 5,
    justifyContent: 'center'
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
    fontWeight: '600'
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
    height: 400,
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
    padding: 22
  },
  calenderContainer: {
    marginTop: 30,
    width: 350,
    height: 350,
    alignSelf: 'center'
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
    backgroundColor: '#eaeef7'
  }
});

const CreateMeeting = ({ route }) => {
    const navigation = useNavigation();
  const { updateTodo } = useStore((state) => ({
    updateTodo: state.updateTodo
  }));

//   console.log("Update to do: ",updateTodo);

  const keyboardHeight = useKeyboardHeight();

  const createNewCalendar = route.params?.createNewCalendar ?? (() => null);
  const updateCurrentTask = route.params?.updateCurrentTask ?? (() => null);
  const currentDate = route.params?.currentDate ?? (() => null);

  const [selectedDay, setSelectedDay] = useState({
    [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format(
      'DD'
    )}`]: {
      selected: true,
      selectedColor: '#2E66E7'
    }
  });
  const [currentDay, setCurrentDay] = useState(moment().format());
  const [taskText, setTaskText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [visibleHeight, setVisibleHeight] = useState(
    Dimensions.get('window').height
  );
  const [isAlarmSet, setAlarmSet] = useState(false);
  const [alarmTime, setAlarmTime] = useState(moment().format());
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [recepientData, setRecepientData] = useState();
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

  const fetchMeetings = async () => {
    try {
        const response = await fetch(`http://${ipAdress}:6000/api/users/meetings/${userId}/${recepientId}`)
        // console.log("response message",response)
        const data = await response.json();
        // console.log("Data ",data);
        if (response.ok) {
            setMeetings(data);
        }
        else {
            console.log("error showing messages", response.status.meeting);
        }
    }
    catch (error) {
        console.log("Error fetching messages", error)
    }
}

useEffect(() => {
    fetchMeetings();
}, [meetings])

useEffect(() => {
    const fetchRecepientData = async () => {
        try {
            const response = await fetch(`http://${ipAdress}:6000/api/users/user/${recepientId}`);
            // console.log("response ", response);
            const data = await response.json();
            // console.log("User data",data)
            setRecepientData(data);
        }
        catch (error) {
            console.log("Error retrieving details ", error);
        }
    }

    fetchRecepientData();
}, [])

  const handleAlarmSet = () => {
    setAlarmSet(!isAlarmSet);
  };

  const synchronizeCalendar = async () => {
    // console.log("Inside Synchronising calendar ");
    const calendarId = await createNewCalendar();
    // console.log("CalendarId as ", calendarId);
    try {
      const createEventId = await addEventsToCalendar(calendarId);
    //   console.log("Create event id ",createEventId)
      handleCreateEventData(createEventId);
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const addEventsToCalendar = async (calendarId) => {
    // console.log("Adding to calendar ");
    const event = {
      title: taskText,
      notes: notesText,
      startDate: moment(alarmTime).add(0, 'm').toDate(),
      endDate: moment(alarmTime).add(5, 'm').toDate(),
      timeZone: Localization.timezone
    };

    // console.log("Event to create is ",event);
    try {
        const calendars = await Calendar.getCalendarsAsync(
            Calendar.EntityTypes.EVENT
          );
        //   console.log(calendarId.toString());
        //   console.log('Here Calendar Events ');
        //   console.log({ calendars });
      const createEventAsyncResNew = await Calendar.createEventAsync(
        calendarId.toString(),
        event
      );
    //   console.log("Event added successfully with ID:", createEventAsyncResNew);
      const calendarsAgain = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
    //   console.log('Here Calendar Events AGAINNN');
    //   console.log({ calendarsAgain });
      return createEventAsyncResNew;
    } catch (error) {
        console.error("Error adding event to calendar:", error);
      console.log(error);
    }
  };

  const showDateTimePicker = () => setDateTimePickerVisible(true);

  const hideDateTimePicker = () => setDateTimePickerVisible(false);

  let idCounter = new Date().getTime();

  function generateUniqueId() {
    return (idCounter++).toString();
  }

  const handleSend = async (creatTodo) => {

    // console.log("Create to in start is", creatTodo);
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

        const response = await fetch(`http://${ipAdress}:6000/api/users/meetings`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
            // setMeetings("");
console.log("Response OK");
            // fetchMeetings();
        }
    }
    catch (error) {
        console.log("Error in sending meetings", error);
    }
}
  
  const handleCreateEventData = async (createEventId) => {
    // console.log("Creating the meeting ",createEventId);
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
            isOn: isAlarmSet,
            createEventAsyncRes: createEventId
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
            color: '#2E66E7',
            selectedDotColor: '#2E66E7'
          }
        ]
      }
    };

    await handleSend(creatTodo);
    // console.log("TO DO : ",creatTodo);
    navigation.goBack();
    await updateTodo(creatTodo);
    updateCurrentTask(currentDate);
  };

  const handleDatePicked = (date) => {
    const selectedDatePicked = currentDay;
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    const newModifiedDay = moment(selectedDatePicked).hour(hour).minute(minute);
    setAlarmTime(newModifiedDay);
    hideDateTimePicker();
  };

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
        <View
          style={{
            height: visibleHeight
          }}
        >
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100
            }}
          >
            <View style={styles.backButton}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginRight: vw / 2 - 120, marginLeft: 20 }}
              >
                <Image
                  style={{ height: 25, width: 40 }}
                  source={require('../assets/back.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Text style={styles.newTask}>New Meeting</Text>
            </View>
            <View style={styles.calenderContainer}>
              <CalendarList
                style={{
                  width: 350,
                  height: 350
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
                      selectedColor: '#2E66E7'
                    }
                  });
                  setCurrentDay(day.dateString);
                  setAlarmTime(day.dateString);
                }}
                monthFormat="yyyy MMMM"
                hideArrows
                markingType="custom"
                theme={{
                  selectedDayBackgroundColor: '#2E66E7',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#2E66E7',
                  backgroundColor: '#eaeef7',
                  calendarBackground: '#eaeef7',
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
              {/* <Text
                style={{
                  fontSize: 14,
                  color: '#BDC6D8',
                  marginVertical: 10
                }}
              >
                Suggestion
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.readBook}>
                  <Text style={{ textAlign: 'center', fontSize: 14 }}>
                    Read book
                  </Text>
                </View>
                <View style={styles.design}>
                  <Text style={{ textAlign: 'center', fontSize: 14 }}>
                    Design
                  </Text>
                </View>
                <View style={styles.learn}>
                  <Text style={{ textAlign: 'center', fontSize: 14 }}>
                    Learn
                  </Text>
                </View>
              </View> */}
              <View style={styles.notesContent} />
              <View>
                <Text style={styles.notes}>Location</Text>
                <TextInput
                  style={{
                    height: 25,
                    fontSize: 19,
                    marginTop: 3,
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
                    fontWeight: '600'
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <View>
                  <Text
                    style={{
                      color: '#9CAAC4',
                      fontSize: 16,
                      fontWeight: '600'
                    }}
                  >
                    Alarm
                  </Text>
                  <View
                    style={{
                      height: 25,
                      marginTop: 3
                    }}
                  >
                    <Text style={{ fontSize: 19 }}>
                      {moment(alarmTime).format('h:mm A')}
                    </Text>
                  </View>
                </View>
                <Switch value={isAlarmSet} onValueChange={handleAlarmSet} />
              </View>
            </View>
            <TouchableOpacity
              disabled={taskText === ''}
              style={[
                styles.createTaskButton,
                {
                  backgroundColor:
                    taskText === '' ? 'rgba(46, 102, 231,0.5)' : '#2E66E7'
                }
              ]}
              onPress={async () => {
                console.log("Alarm set as ",isAlarmSet)
                if (isAlarmSet) {
                  await synchronizeCalendar();
                }
                if (!isAlarmSet) {
                  handleCreateEventData();
                }
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#fff'
                }}
              >
                ADD YOUR TASK
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Fragment>
  );
}

export default CreateMeeting
