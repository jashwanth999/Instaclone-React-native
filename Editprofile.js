import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from 'react-native-elements';
import { Avatar, Accessory, Button } from 'react-native-elements';
import { auth, storage, db } from './firebase.js';
import * as ImagePicker from 'expo-image-picker';
import firebase from '@firebase/app';

function Edit({ navigation }) {
  const user = auth.currentUser;
  const [propic, setPropic] = useState(null);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState(`${user?.displayName}`);
  const [bio, setBio] = useState('');
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
    setPropic(null);
  };
  const uploadImage = async () => {
    const response = await fetch(image);
    const blob = await response.blob(image);

    const uploadTask = storage.ref('propics').child('propic').put(blob);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },

      () => {
        storage
          .ref('propics')
          .child('propic')
          .getDownloadURL()
          .then((url) => {
            db.collection('users').doc(user?.uid).update({
              propic: url,
              username: username,
              bio: bio,
            });
          });
      }
    );
  };
  useEffect(() => {
    if (user?.uid) {
      db.collection('users')
        .doc(user?.uid)
        .onSnapshot((doc) => {
          setPropic(doc.data().propic);
        });
    }
  }, [user.uid]);

  return (
    <View style={{ backgroundColor: 'black', height: "100%" }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
        }}
        leftComponent={
          <MaterialCommunityIcons
            onPress={() => navigation.goBack()}
            name="close"
            size={28}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
        centerComponent={{
          text: 'Edit Profile',
          style: { color: 'black', fontSize: 23, marginRight: 30 },
        }}
        rightComponent={
          <MaterialCommunityIcons
            onPress={uploadImage}
            name="check"
            size={28}
            color="blue"
            style={{ marginLeft: '3%' }}
          />
        }
      />
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 20,
          flexDirection: 'column',
        }}>
        {propic ? (
          <Avatar
            size="xlarge"
            rounded
            source={{
              uri: `${propic}`,
            }}
          />
        ) : (
          <Avatar
            size="xlarge"
            rounded
            source={{
              uri: `${image}`,
            }}
          />
        )}

        <Button
          title="change Profile Photo"
          onPress={pickImage}
          type="solid-button"
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
            color: 'white',
            height: 44,
            padding: 10,
            fontSize: 20,
          }}
          placeholder="bio"
          value={bio}
          textColor="white"
          placeholderTextColor="white"
          onChangeText={(bio) => setBio(bio)}
        />
      </View>
    </View>
  );
}
export default Edit;
