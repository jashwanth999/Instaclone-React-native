import React, { useState, useEffect, Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { Button, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { db, auth } from './firebase.js';

function Register({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const Signup = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        db.collection('users').doc(authUser.user.uid).set({
          username: username,
          email: email,
          password: password,
          userid: authUser.user.uid,
          propic:
            'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png',
        });
        return authUser.user.updateProfile({
          displayName: username,
        });
      })

      .then(() => {
        toggleOverlay();
      })
      .catch((error) => alert(error.message));
    setUsername('');
    setEmail('');
    setPassword('');
  };
  const user = auth.currentUser;
  const ok = () => {
    navigation.navigate('Login');
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
      }}>
      <Text
        style={{
          fontSize: 40,
          color: 'white',
          position: 'relative',
          bottom: 15,
          fontFamily: 'notoserif',
        }}>
        {' '}
        Kingsgram
      </Text>
      <View
        style={{
          borderWidth: 1,
          width: '95%',
          borderRadius: 8,
          margin: 10,
          backgroundColor: '#383838',
        }}>
        <TextInput
          style={{
            outline: 'none',
            height: 44,
            padding: 10,
            color: 'white',
            fontSize: 20,
          }}
          placeholder="username"
          value={username}
          textColor="white"
          placeholderTextColor="white"
          onChangeText={(username) => setUsername(username)}
        />
      </View>
      <View
        style={{
          borderWidth: 1,
          width: '95%',
          borderRadius: 8,
          margin: 10,
          backgroundColor: '#383838',
        }}>
        <TextInput
          style={{
            outline: 'none',
            height: 44,
            padding: 10,
            color: 'white',
            fontSize: 20,
          }}
          placeholder="email"
          value={email}
          textColor="white"
          placeholderTextColor="white"
          onChangeText={(email) => setEmail(email)}
        />
      </View>
      <View
        style={{
          borderWidth: 1,
          width: '95%',
          borderRadius: 8,
          margin: 10,
          backgroundColor: '#383838',
        }}>
        <TextInput
          style={{
            outline: 'none',
            height: 44,
            padding: 10,
            color: 'white',
            fontSize: 20,
          }}
          placeholder="Password"
          value={password}
          textColor="white"
          placeholderTextColor="white"
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity onPress={Signup}>
        <View
          style={{
            width: 340,
            backgroundColor: '#3498DB',
            height: 34,
            borderRadius: 8,
          }}>
          <Text
            style={{ color: 'white', position: 'relative', left: 150, top: 7 }}>
            Sign Up
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
          top: 35,
        }}>
        <Text style={{ color: 'white', position: 'relative', top: 12 }}>
          Already have an account?{' '}
        </Text>
        <Button
          type="Solid-Button"
          title="Login."
          onPress={() => navigation.navigate('Login')}
        />
      </View>
      <Overlay isVisible={visible}>
        <View style={{ width: 140, borderRadius: 15 }}>
          <Text style={{ fontSize: 20 }}>Signup Successfull.</Text>
          <TouchableOpacity onPress={ok}>
            <Text style={{ color: '#24a0ed' }}> please login</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </View>
  );
}

export default Register;
