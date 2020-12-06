import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-elements';
import { auth, db, storage } from './firebase.js';
import firebase from '@firebase/app';

function Chatcamera({ navigation, route }) {
  const { image, username, id, userpropic } = route.params;
  const [propic, setPropic] = useState(null);
  const [act, setAct] = useState(false);

  const user = auth.currentUser;
  useEffect(() => {
    try {
      if (user?.uid) {
        db.collection('users')
          .doc(user?.uid)
          .onSnapshot((doc) => {
            setPropic(doc.data().propic);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  const uploadImage = async () => {
    setAct(true);
    const response = await fetch(image);
    const blob = await response.blob(image);

    const uploadTask = storage.ref('images').child('imagesname').put(blob);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 0.1
        );
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },

      () => {
        storage
          .ref('images')
          .child('imagesname')
          .getDownloadURL()
          .then((url) => {
            db.collection('messages').add({
              message: '',
              user_id_1: user?.uid,
              user_id_2: id,
              username: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              chatimage: url,
            });
          })
          .then(() => {
            setAct(false);
            navigation.navigate('chatfeeds', {
              username: username,
              roomid: id,
              propic: userpropic,
            });
          });
      }
    );
  };
  return (
    <View style={{ backgroundColor: 'black', height: '100%' }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
        }}
        placement="left"
        leftComponent={
          <Icons
            onPress={() => navigation.goBack()}
            name={'close'}
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
      />
      {act ? (
        <View
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="small" color="white" />
        </View>
      ) : (
        <View>
          <Image
            source={{ uri: image }}
            style={{ width: 360, height: 600, resizeMode: 'contain' }}
          />
          <TouchableOpacity
            onPress={uploadImage}
            style={{ position: 'absolute', bottom: 30, left: 150 }}>
            <View>
              <Avatar
                rounded
                source={{
                  uri: `${userpropic}`,
                }}
                size="large"
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
export default Chatcamera;
