import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Header } from 'react-native-elements';
import { Card, ListItem, Icon } from 'react-native-elements';
import { db, auth } from './firebase.js';
import Userlist from './Userlist.js';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Chatusers from './Chatusers.js';
import { Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
function Chat({ navigation }) {
  const [using, setUsers] = useState([]);
  const [Messages, setMessages] = useState([]);
  const user = auth.currentUser;

  const { Height } = Dimensions.get('window');
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('messages')
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data(),
          }))
        );
      });
  }, []);
  return (
    <View style={{ backgroundColor: 'black', height: '100%' }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
          borderBottomColor: 'none',
        }}
        placement="left"
        leftComponent={
          <Icons
            onPress={() => navigation.navigate('Home')}
            name={'arrow-back'}
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
        centerComponent={{
          text: user?.displayName,
          style: { color: 'white', fontSize: 23, marginRight: 30 },
        }}
      />
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('searchpeople')}
          style={{ width: '94%', margin: 10 }}>
          <View
            style={{
              height: 40,
              backgroundColor: '#383838',
              outline: 'none',
              width: '100%',
              borderRadius: 10,
            }}>
            <Text style={{ color: 'white', fontSize: 17, padding: 10 }}>
              {' '}
              Search
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={{ margin: 10, fontSize: 18, color: 'white' }}>
          Messages
        </Text>
        <View>
          <ScrollView style={{ height: '66%' }}>
            {using.map(({ id, users }) => (
              <Chatusers
                key={id}
                id={id}
                username={users.username}
                navigation={navigation}
                user={user}
                propic={users.userpropic}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('cam')}
        style={{
          position: 'relative',
          bottom: 0,
          backgroundColor: '#383838',
          height: '7%',
          width: '100%',
          alignItems: 'center',
        }}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name="camera"
            size={30}
            color="#3498DB"
            style={{ marginTop: '3%' }}
          />
          <Text style={{ color: '#3498DB', fontSize: 18, marginTop: '3%' }}>
            {' '}
            Camera
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
export default Chat;
