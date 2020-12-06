import React, { useState, useEffect, useRef } from 'react';
import { Button, Overlay } from 'react-native-elements';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import { Input } from 'react-native-elements';
import * as firebase from 'firebase';
import { Card, ListItem, Icon } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { db, auth, storage } from './firebase.js';
import Homepost from './Homepost.js';
import { Avatar, Accessory } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ProgressBar, Colors } from 'react-native-paper';
import { Camera } from 'expo-camera';

const Home = ({ navigation }) => {
  const user = auth.currentUser;
  const [images, setImages] = useState([]);
  const [propic, setPropic] = useState(null);
  const [story, setStory] = useState(null);
  const [stories, setStories] = useState([]);
  const [image, setImage] = useState(null);

  const [id, setId] = useState('');
  
  useEffect(() => {
    db.collection('images')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setImages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        );
      });
  }, []);
  useEffect(() => {
    db.collection('stories')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setStories(snapshot.docs.map((doc) => doc.data()));
      });
  }, []);
  useEffect(() => {
    if (user?.uid) {
      db.collection('users')
        .doc(user?.uid)
        .onSnapshot((doc) => {
          setPropic(doc.data().propic), setStory(doc.data().storyurl);
        });
    }
  }, [user?.uid]);
  setInterval(() => {
    db.collection('stories').doc(user.uid).delete();
    db.collection('users').doc(user.uid).update({
      storyurl: null,
    });
    setStory(null);
  }, 1000 * 60 * 60 * 12);

  return (
    <View style={{ backgroundColor: 'black', flex: 1 }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
          borderBottomColor: 'none',
        }}
        leftComponent={
          <MaterialCommunityIcons
            onPress={() => navigation.navigate('cam')}
            name="camera-outline"
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
        centerComponent={{
          text: 'Kingsgram',
          style: { color: 'white', fontSize: 23 },
        }}
        rightComponent={
          <MaterialCommunityIcons
            onPress={() => navigation.navigate('chat')}
            name="telegram"
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
      />

      <ScrollView style={{ height: 590 }}>
        <View
          style={{
            marginLeft: 8,
            marginTop: 4,
            display: 'flex',
            flexDirection: 'row',
            height: 85,
            flex:1
          }}>
          <View style={{ marginRight: 5 }}>
            {story ? (
              <View
                style={{
                  borderWidth: 3,
                  borderColor: '#FF5733',
                  borderRadius: 60,
                }}>
                <Avatar
                  onPress={() =>
                    navigation.navigate('storyview', {
                      story: story,
                      id: user.uid,
                      username: user.displayName,
                      propic: propic,
                    })
                  }
                  rounded
                  size="large"
                  source={{
                    uri: `${propic}`,
                  }}></Avatar>
              </View>
            ) : (
              <View>
                <Avatar
                  onPress={() => navigation.navigate('cam')}
                  rounded
                  size="large"
                  source={{
                    uri: `${propic}`,
                  }}
                />
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={21}
                  color="#3498DB"
                  style={{
                    zIndex: 1,
                    position: 'relative',
                    left: 50,
                    bottom: 20,
                  }}
                />
              </View>
            )}
          </View>
          <View>
            <ScrollView horizontal={true}>
           
              {stories.map((s) =>
                s.username !== user?.displayName ? (
                  <View
                    style={{
                      margin: 2,
                      borderWidth: 3,
                      borderColor: '#33C3FF',
                      borderRadius: 100,
                    }}>
                    <Avatar
                      onPress={() =>
                        navigation.navigate('storyview', {
                          story: s.storyurl,
                          username: s.username,
                          propic: s.propic,
                          id: s.userid,
                        })
                      }
                      rounded
                      size="large"
                      source={{
                        uri: `${s.propic}`,
                      }}
                    />
                  </View>
                ) : (
                  <View></View>
                )
              )}
            </ScrollView>
          </View>
        </View>

        {images.map(({ id, value }) => (
          <Homepost
            key={id}
            id={id}
            imageurl={value.photourl}
            user={user}
            timestamp={value.timestamp?.toDate().toISOString()}
            username={value.username}
            caption={value.caption}
            navigation={navigation}
            propic={value.propic}
            piclikes={value.likes}
            mainpropic={propic}
            userid={value.userid}
            videourl={value.videourl}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;
