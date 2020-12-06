import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, db, auth } from './firebase.js';
import { ProgressBar, Colors } from 'react-native-paper';
import { Input } from 'react-native-elements';
import firebase from '@firebase/app';
import { Header } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
function Highlight({ navigation }) {
  const user = auth.currentUser;
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [progress, setProgess] = useState(0);
  const [propic, setPropic] = useState(null);
  const uploadImage = async () => {
    const response = await fetch(image);
    const blob = await response.blob(image);

    const uploadTask = storage.ref('images').child('imagesname').put(blob);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 10
        );
        setProgess(progress);
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
            db.collection('users').doc(user.uid).collection('highlights').add({
              highlighturl: url,
            });

            setImage(null);
            setCaption('');
            setProgess(0);
          });
      }
    );
  };

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
  };
  useEffect(() => {
    if (user?.uid) {
      db.collection('users')
        .doc(user?.uid)
        .onSnapshot((doc) => {
          setPropic(doc.data().propic);
        });
    }
  }, [user?.uid]);

  return (
    <View>
      <Header
        containerStyle={{
          backgroundColor: 'white',
        }}
        leftComponent={
          <MaterialCommunityIcons
            onPress={() => navigation.navigate('Profile')}
            name="close"
            size={28}
            color="black"
            style={{ marginLeft: '3%' }}
          />
        }
        centerComponent={{
          text: 'New post',
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
      <ProgressBar
        style={{ height: 20 }}
        progress={progress}
        color={Colors.red800}
      />

      {image && (
        <Image source={{ uri: image }} style={{ width: 360, height: 400 }} />
      )}
      <Input
        placeholder="caption"
        value={caption}
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Choose Photo" onPress={pickImage} />
    </View>
  );
}
export default Highlight;
