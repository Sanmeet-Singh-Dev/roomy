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
import DateTimePicker from 'react-native-modal-datetime-picker';
import useKeyboardHeight from '../hooks/useKeyboardHeight';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import { IPADDRESS } from "@env"

const { width: vw } = Dimensions.get('window');

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
    padding: 38
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

  const keyboardHeight = useKeyboardHeight();

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

        const response = await fetch(`http://${ipAdress}:6000/api/users/meetings`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
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

      const response = await fetch(`http://${ipAdress}:6000/api/users/request-notification`, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
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
            color: '#2E66E7',
            selectedDotColor: '#2E66E7'
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

  return (
    <Fragment>
      <DateTimePicker
        isVisible={isDateTimePickerVisible}
        onConfirm={handleDatePicked}
        onCancel={hideDateTimePicker}
        mode="time"
        date={new Date()}
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
                  handleCreateEventData();
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
