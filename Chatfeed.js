import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Header, Avatar } from 'react-native-elements';
import { Input } from 'react-native-elements';
import { db, auth } from './firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '@firebase/app';
import Conv from './Conv.js';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
} from 'react-native';
function Chatfeed({ route, navigation }) {
  const { roomid, username, propic } = route.params;
  const [message, setmessage] = useState('');
  const [chating, setChats] = useState([]);
  const [image, setImage] = useState(null);
  const user = auth.currentUser;
  useEffect(() => {
    try {
      db.collection('users')
        .doc(user.uid)
        .onSnapshot((doc) => {
          setImage(doc.data().propic);
        });
    } catch (error) {
      console.log(error);
    }
  });
  const scrollref = React.createRef();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
  const send = () => {
    try {
      db.collection('messages').add({
        message: message,
        user_id_1: user?.uid,
        user_id_2: roomid,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        chatimage: null,
        video:null
      });
      db.collection('users')
        .doc(user.uid)
        .collection('messages')
        .doc(roomid)
        .set({
          username: username,
          userid: roomid,
          userpropic: propic,
        });
      db.collection('users')
        .doc(roomid)
        .collection('messages')
        .doc(user.uid)
        .set({
          username: user.displayName,
          userid: user.uid,
          userpropic: image,
        });
      setmessage('');
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (roomid) {
      db.collection('messages')
        .orderBy('timestamp', 'asc')

        .onSnapshot((snapshot) => {
          setChats(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              chats: doc.data(),
            }))
          );
        });
    }
  }, [roomid]);
  return (
    <View style={{ backgroundColor: 'black', height: '100%', flex: 1 }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
        }}
        leftComponent={
          <MaterialCommunityIcons
            onPress={() => navigation.navigate('chat')}
            name="arrow-left"
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
        centerComponent={
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Avatar
              rounded
              source={{
                uri: `${propic}`,
              }}
            />
            <Text
              style={{ fontSize: 20, marginLeft: 10, color: 'white' }}
              onPress={() =>
                navigation.navigate('userprofile', {
                  username: username,
                  userid: roomid,
                })
              }>
              {username}
            </Text>
          </View>
        }
        rightComponent={
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
      />

      <View>
        <ScrollView style={{ height: '81%' }}>
          {chating.map(({ id, chats }) => (
            <Conv
              key={id}
              id={id}
              roomid={roomid}
              chat={chats.message}
              username={chats.username}
              user={user}
              user_id_1={chats.user_id_1}
              user_id_2={chats.user_id_2}
              propic={propic}
              chatimage={chats.chatimage}
              video={chats.video}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ bottom: 0, position: 'absolute' }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            borderColor: 'gray',
            margin: 3,
            borderRadius: 30,
            backgroundColor: '#383838',
          }}>
          <View
            style={{ backgroundColor: '#24a0ed', borderRadius: 50, margin: 3 }}>
            <MaterialCommunityIcons
              onPress={() =>
                navigation.navigate('cam2', {
                  propic: propic,
                  id: roomid,
                  username: username,
                })
              }
              name="camera"
              size={30}
              color="white"
              style={{ padding: 4 }}
            />
          </View>

          <TextInput
            style={styles.textInput}
            onChangeText={(message) => setmessage(message)}
            value={message}
            placeholder="message"
            placeholderTextColor="white"
            onSubmitEditing={send}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  textInput: {
    height: 42,
    outline: 'none',
    marginLeft: 6,
    width: '86%',
    color: 'white',
    fontSize: 18,
    padding: 5,
  },
});

export default Chatfeed;
