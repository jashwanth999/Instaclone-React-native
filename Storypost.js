import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, Platform, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, db, auth } from './firebase.js';
import { ProgressBar, Colors } from 'react-native-paper';
import { Input } from 'react-native-elements';
import firebase from '@firebase/app';
import { Header } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
function Storypost({ navigation }) {
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
          (snapshot.bytesTransferred / snapshot.totalBytes) * 0.1
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
            db.collection('stories').doc(user.uid).set({
              storyurl: url,
              caption: caption,
              username: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              propic: propic,
            });
            db.collection('users').doc(user.uid).update({
              storyurl: url,
            });
          })
          .then(() => {
            navigation.navigate('Home');
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
    <View style={{ backgroundColor: 'black', height: 720 }}>
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
          text: 'New post',
          style: { color: 'white', fontSize: 23, marginRight: 30 },
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
        progress={progress}
        style={{ height: 20 }}
        color={Colors.red900}
      />

      {image ? (
        <View>
          <Image source={{ uri: image }} style={{ width: 360, height: 400 }} />
        </View>
      ) : (
        <View>
          <Image source={{ uri: '' }} style={{ width: 360, height: 400 }} />
        </View>
      )}

      <View
        style={{
          borderWidth: 1,
          width: '95%',
          borderRadius: 8,
          margin: 10,
          backgroundColor: '#383838',
        }}>
        <TextInput
          style={{ outline: 'none', color: 'white', height: 34, padding: 10 }}
          placeholder="Add caption"
          value={caption}
          textColor="white"
          placeholderTextColor="white"
          onChangeText={(caption) => setCaption(caption)}
        />
      </View>
      <Button title="Choose Photo" onPress={pickImage} />
    </View>
  );
}
export default Storypost;
