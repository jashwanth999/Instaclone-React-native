import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Header, Button } from 'react-native-elements';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements';
import { auth, db } from './firebase.js';
import Myposts from './Myposts.js';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheet } from 'react-native-btr';
import { MaterialIcons } from '@expo/vector-icons';

function Profile({ navigation }) {
  const user = auth.currentUser;
  const [propic, setPropic] = useState(null);
  const [highlighturl, setHighlighturl] = useState(null);
  const [images, setImages] = useState([]);
  const [Following, setFollowing] = useState([]);
  const [Followers, setFollowers] = useState([]);
  const [highlight, setHighlight] = useState([]);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('Add bio');
  const [visible, setVisible] = useState(false);
  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    db.collection('images')
      .orderBy('timestamp', 'desc')
      .where('username', '==', user.displayName)
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
    try {
      if (user?.uid) {
        db.collection('users')
          .doc(user?.uid)
          .onSnapshot((doc) => {
            setPropic(doc.data().propic);
            setBio(doc.data().bio);
            setUsername(doc.data().username);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, [user.uid]);

  useEffect(() => {
    db.collection('users')
      .doc(user?.uid)
      .collection('highlights')
      .onSnapshot((snapshot) => {
        setHighlight(snapshot.docs.map((doc) => doc.data()));
      });
  }, [user.uid]);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('followers')
      .onSnapshot((snapshot) => {
        setFollowers(snapshot.docs.map((doc) => doc.data()));
      });
  }, [user.uid]);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('following')
      .onSnapshot((snapshot) => {
        setFollowing(snapshot.docs.map((doc) => doc.data()));
      });
  }, [user.uid]);

  return (
    <View style={{ display: 'flex', backgroundColor: 'black', height: '100%' }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
          borderBottomColor: 'none',
        }}
        placement="left"
        leftComponent={
          <Text style={{ fontSize: 23, color: 'white' }}>
            {user?.displayName}
          </Text>
        }
        rightComponent={
          <MaterialCommunityIcons
            onPress={toggleBottomNavigationView}
            name="menu"
            size={30}
            color="white"
            style={{}}
          />
        }
      />
      <View style={{ display: 'flex', flexDirection: 'row', margin: 10 }}>
        <View style={{ flex: 0.5 }}>
          <Avatar
            rounded
            source={{
              uri: `${propic}`,
            }}
            size="large"
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            flex: 1,
          }}>
          <View style={{ display: 'flex', flexDirection: 'column', margin: 6 }}>
            <Text
              style={{
                position: 'relative',
                left: 10,
                fontSize: 20,
                color: 'white',
              }}>
              {images.length}
            </Text>
            <Text style={{ color: 'white' }}>posts</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: 6,
              position: 'relative',
              left: 12,
            }}>
            <Text
              onPress={() =>
                navigation.navigate('followview', { id: user.uid })
              }
              style={{
                position: 'relative',
                left: 20,
                fontSize: 20,
                color: 'white',
              }}>
              {Followers.length}
            </Text>
            <Text style={{ color: 'white' }}>Followers</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: 6,
              position: 'relative',
              left: 20,
            }}>
            <Text
              onPress={() =>
                navigation.navigate('followingview', { id: user.uid })
              }
              style={{
                position: 'relative',
                left: 20,
                fontSize: 20,
                color: 'white',
              }}>
              {Following.length}
            </Text>
            <Text style={{ color: 'white' }}>Following</Text>
          </View>
        </View>
      </View>
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        <Text style={{ fontSize: 16, marginLeft: 15, color: 'white' }}>
          {username}
        </Text>
        <Text style={{ fontSize: 16, marginLeft: 15, color: 'white' }}>
          {bio}
        </Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('edit')}>
        <View
          style={{
            borderWidth: 1,
            width: '90%',
            borderRadius: 8,
            margin: 10,
            backgroundColor: '#383838',
            height: 40,
            marginLeft: 18,
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 20 }}> Edit profile</Text>
        </View>
      </TouchableOpacity>

      <View style={{ display: 'flex', flexDirection: 'row', margin: 6 }}>
        <TouchableOpacity onPress={() => navigation.navigate('highlight')}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              top: 2,
            }}>
            <View
              style={{
                borderRadius: 100,
                height: 50,
                width: 50,
                borderWidth: 1,
                backgroundColor: '#383838',
              }}>
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color="white"
                style={{ position: 'relative', top: 14, left: 14 }}
              />
            </View>
            <Text style={{ color: 'white', position: 'relative', left: 7 }}>
              new
            </Text>
          </View>
        </TouchableOpacity>

        <ScrollView horizontal={true}>
          {highlight.map((s) => (
            <View
              style={{ margin: 3, display: 'flex', flexDirection: 'column' }}>
              <Avatar
                onPress={() =>
                  navigation.navigate('storyview', { story: s.highlighturl })
                }
                rounded
                size="medium"
                source={{
                  uri: `${s.highlighturl}`,
                }}
              />
              <Text style={{ color: 'white', position: 'relative', left: 8 }}>
              
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={{ alignItems: 'center' }}>
        <MaterialCommunityIcons
          style={{ marginRight: 12, color: 'white' }}
          name="apps"
          size={30}
          color="white"
        />

        <ScrollView style={{ height: 340 }}>
          <View
            style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {images.map(({ id, value }) => (
              <Myposts
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
                videourl={value.videourl}
              />
            ))}
          </View>
        </ScrollView>

        <BottomSheet
          visible={visible}
          onBackButtonPress={toggleBottomNavigationView}
          onBackdropPress={toggleBottomNavigationView}>
          <View
            style={{
              height: '60%',
              backgroundColor: 'black',
              borderRadius: 15,
              width: '100%',
            }}>
            <TouchableOpacity
          onPress={toggleBottomNavigationView}
            style={{ width: '100%', alignItems: 'center' }}>
            <View
              style={{
                width: 50,
                height: 10,
                backgroundColor: 'gray',
                borderRadius: 15,
              }}></View>
          </TouchableOpacity>
            
            <TouchableOpacity   onPress={()=>{
              navigation.navigate("save");
              toggleBottomNavigationView()
              }} style={{ margin: 15 }}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <MaterialCommunityIcons
                
                  name="bookmark"
                  size={30}
                  color="white"
                  style={{}}
                />
                <Text style={{ fontSize: 18, color: 'white' }}> Saved</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={{ margin: 15 }}  onPress={()=>
                  {
                     toggleBottomNavigationView()
                     navigation.navigate("Login")
                      auth.signOut()
                  
                  }}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <MaterialCommunityIcons
                 
                  name="logout"
                  size={30}
                  color="#F71F04"
                  style={{}}
                />
                <Text style={{ fontSize: 18, color: '#F71F04' }}> Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </View>
    </View>
  );
}
export default Profile;
