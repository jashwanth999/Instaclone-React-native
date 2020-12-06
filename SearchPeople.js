import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TextInput } from 'react-native';
import { Header } from 'react-native-elements';
import { Card, ListItem, Icon } from 'react-native-elements';
import { db, auth } from './firebase.js';
import Userlist from './Userlist.js';
import Icons from 'react-native-vector-icons/MaterialIcons';
function SearchPeople({ navigation }) {
  const user = auth.currentUser;
  const [using, setUsers] = useState([]);
  const [value, setValue] = useState('');
  setImmediate(() => {
    ref();
  });
  const ref = () => {
    db.collection('users')
      .where('username', '==', value)
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data(),
          }))
        );
      });
  };

  return (
    <View style={{ backgroundColor: 'black', height: "100%" }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
        }}
        leftComponent={
          <Icons
            onPress={() => navigation.goBack()}
            name={'arrow-back'}
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
        centerComponent={
          <TextInput
            value={value}
            onChangeText={(value) => setValue(value)}
            placeholderTextColor="white"
            textColor="white"
            style={{
              height: 40,
              backgroundColor: '#383838',
              outline: 'none',
              width: '100%',
              borderRadius: 10,
              padding: 10,
              fontSize: 17,
              color: 'white',
            }}
            placeholder="Search"
          />
        }
      />

      {using.map(({ id, users }) => (
        <Userlist
          key={id}
          id={id}
          username={users.username}
          navigation={navigation}
          user={user}
          propic={users.propic}
        />
      ))}
    </View>
  );
}
export default SearchPeople;
