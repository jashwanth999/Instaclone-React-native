import React, { useState, useEffect, Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { Button } from 'react-native-elements';
import { Input } from 'react-native-elements';
import { db, auth } from './firebase.js';

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signin = (event) => {
    const user = auth.currentUser;

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {})
      .then(() => {
        navigation.navigate('splash');
      })
      .catch((error) => alert(error.message));

    setEmail('');
    setPassword('');
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
          placeholder="Email"
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
            color: 'white',
            height: 44,
            padding: 10,
            fontSize: 20,
          }}
          placeholder="Password"
          value={password}
          textColor="white"
          placeholderTextColor="white"
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity onPress={signin}>
        <View
          style={{
            width: 340,
            backgroundColor: '#3498DB',
            height: 34,
            borderRadius: 8,
          }}>
          <Text
            style={{ color: 'white', position: 'relative', left: 150, top: 7 }}>
            Log in
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
          Don't have an account?{' '}
        </Text>
        <Button
          type="Solid-Button"
          title="Sign Up."
          onPress={() => navigation.navigate('register')}
        />
      </View>
    </View>
  );
}

export default Login;
