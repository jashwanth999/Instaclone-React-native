import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Button,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, db, auth } from './firebase.js';
import { ProgressBar, Colors } from 'react-native-paper';
import { Input } from 'react-native-elements';
import firebase from '@firebase/app';
import { Header } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
function Post({ navigation, route }) {
  const user = auth.currentUser;
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [progress, setProgess] = useState(0);
  const [propic, setPropic] = useState(null);
  const [act, setact] = useState(false);
  const uploadImage = async () => {
    setact(true);
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
            db.collection('images')
              .add({
                photourl: url,
                caption: caption,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                propic: propic,
                userid: user.uid,
              })
              .then(() => {
                setact(false);
                navigation.navigate('Home');
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
      aspect: [5, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
   const pickImage2 = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [5, 4],
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
  }, [user.uid]);

  return (
    <View style={{ backgroundColor: 'black', height: '100%' }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
        }}
        leftComponent={
          <MaterialCommunityIcons
            onPress={() => navigation.navigate('Home')}
            name="close"
            size={30}
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
            size={30}
            color="#24a0ed"
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
          {image ? (
            <View onPress={pickImage}>
              <Image
                source={{ uri: image }}
                style={{ width: '100%', height: 300 }}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={pickImage}>
              <View>
                <Image
                  source={{
                    uri:
                      'data:image/jpeg;base64,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',
                  }}
                  style={{ width: '100%', height: 300 }}
                />
              </View>
            </TouchableOpacity>
          )}

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderColor: 'gray',
              margin: 3,
              borderRadius: 40,
              position: 'relative',
            }}>
            <View style={{ margin: 5 }}>
              <Avatar
                rounded
                source={{
                  uri: `${propic}`,
                }}
              />
            </View>

            <TextInput
              style={{
                height: 44,
                outline: 'none',
                marginLeft: 6,
                color: 'white',
                fontSize:18
                
              }}
              onChangeText={(caption) => setCaption(caption)}
              value={caption}
              placeholder="Write a caption"
              placeholderTextColor="white"
              textColor="white"
            />
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TouchableOpacity onPress={pickImage} style={{ width: '90%' }}>
              <View
                style={{
                  borderWidth: 1,
                  width: '70%',
                  borderRadius: 8,
                  margin: 10,
                  backgroundColor: '#383838',
                  height: 40,
                  marginLeft: 1,
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: 'white', fontSize: 20, marginTop: 2 }}>
                  Gallery
                </Text>
              </View>
            </TouchableOpacity>
            <MaterialCommunityIcons
              onPress={pickImage2}
              name="camera"
              size={30}
              color="white"
              style={{ marginTop: 15 }}
            />
          </View>
          <TouchableOpacity onPress={()=>navigation.navigate("video")} style={{ width: '90%' }}>
              <View
                style={{
                  borderWidth: 1,
                  width: '70%',
                  borderRadius: 8,
                  margin: 10,
                  backgroundColor: '#383838',
                  height: 40,
                  marginLeft: 1,
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: 'white', fontSize: 20, marginTop: 2 }}>
                  Post video
                </Text>
              </View>
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
export default Post;
