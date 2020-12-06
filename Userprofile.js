import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Header, Button } from 'react-native-elements';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements';
import { auth, db } from './firebase.js';
import Myposts from './Myposts.js';
import Userposts from './Userposts';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Userprofile({ navigation, route }) {
  const { userid, username } = route.params;
  const user = auth.currentUser;
  const [isfollowing, setisFollowing] = useState(false);
  const [propic, setPropic] = useState(null);
  const [userpropic, setuserPropic] = useState(null);
  const [Followers, setFollowers] = useState([]);
  const [Following, setFollowing] = useState([]);
  const [usersfollowing, setusersfollowing] = useState([]);

  const [images, setImages] = useState([]);
  useEffect(() => {
    db.collection('images')
      .orderBy('timestamp', 'desc')
      .where('username', '==', username)
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
      if (userid) {
        db.collection('users')
          .doc(userid)
          .onSnapshot((doc) => {
            setPropic(doc.data().propic);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, [userid]);
  useEffect(() => {
    try {
      if (user.uid) {
        db.collection('users')
          .doc(user.uid)
          .onSnapshot((doc) => {
            setuserPropic(doc.data().propic);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, [user.uid]);
  useEffect(() => {
    db.collection('users')
      .doc(userid)
      .collection('followers')
      .onSnapshot((snapshot) => {
        setFollowers(snapshot.docs.map((doc) => doc.data()));
      });
  }, [userid]);
  useEffect(() => {
    db.collection('users')
      .doc(userid)
      .collection('following')
      .onSnapshot((snapshot) => {
        setFollowing(snapshot.docs.map((doc) => doc.data()));
      });
  }, [userid]);

  const follow = () => {
    if (propic) {
      db.collection('users')
        .doc(user.uid)
        .collection('following')
        .doc(userid)
        .set({
          username: username,
          followingid: userid,
          propic: propic,
          isfollowing: true,
        });
    } else {
      db.collection('users')
        .doc(user.uid)
        .collection('following')
        .doc(userid)
        .set({
          username: username,
          followingid: userid,
          propic:
            'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png',
          isfollowing: true,
        });
    }
    if (userpropic) {
      db.collection('users')
        .doc(userid)
        .collection('followers')
        .doc(user.uid)
        .set({
          username: user.displayName,
          followerid: user.uid,
          userpropic: userpropic,
        });
    } else {
      db.collection('users')
        .doc(userid)
        .collection('followers')
        .doc(user.uid)
        .set({
          username: user.displayName,
          followerid: user.uid,
          userpropic:
            'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png',
        });
    }
  };
  const unfollow = () => {
    db.collection('users')
      .doc(user.uid)
      .collection('following')
      .doc(userid)
      .delete();

    db.collection('users')
      .doc(userid)
      .collection('followers')
      .doc(user.uid)
      .delete();
    db.collection('users')
      .doc(user.uid)
      .collection('following')
      .doc(userid)
      .update({
        isfollowing: false,
      });
  };

  useEffect(() => {
    try {
      db.collection('users')
        .doc(user.uid)
        .collection('following')
        .doc(userid)
        .onSnapshot((doc) => {
          setusersfollowing(doc.data());
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const f = usersfollowing?.isfollowing;

  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'black',
      }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
        }}
        placement="left"
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
          <Text style={{ fontSize: 23, color: 'white' }}>{username}</Text>
        }
      />
      <View style={{ display: 'flex', flexDirection: 'row', margin: 10 }}>
        <Avatar
          rounded
          source={{
            uri: `${propic}`,
          }}
          size="large"
        />

        <View
          style={{
            position: 'relative',
            top: 10,
            left: 30,
            display: 'flex',
            flexDirection: 'row',
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
      <Text
        style={{
          fontSize: 16,
          marginLeft: 28,
          position: 'relative',
          bottom: 10,
          color: 'white',
        }}>
        {username}
      </Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        {f ? (
          <View style={{ width: 160, margin: 10 }}>
            <Button title="unfollow" type="outline" onPress={unfollow} />
          </View>
        ) : (
          <View style={{ width: 160, margin: 10 }}>
            <Button title="follow" onPress={follow} />
          </View>
        )}

        <View style={{ width: 160, margin: 10 }}>
          {propic ? (
            <Button
              title="Message"
              onPress={() =>
                navigation.navigate('chatfeeds', {
                  roomid: userid,
                  username: username,
                  propic: propic,
                })
              }
              type="outline"
            />
          ) : (
            <Button
              title="Message"
              onPress={() =>
                navigation.navigate('chatfeeds', {
                  roomid: userid,
                  username: username,
                  propic:
                    'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png',
                })
              }
              type="outline"
            />
          )}
        </View>
      </View>
      <View style={{ alignItems: 'center' }}>
        <MaterialCommunityIcons
          style={{ marginRight: 12, color: 'white' }}
          name="apps"
          size={30}
          color="white"
        />

        <ScrollView style={{ height: 400 }}>
          <View
            style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {images.map(({ id, value }) => (
              <Userposts
                key={id}
                id={id}
                imageurl={value.photourl}
                user={username}
                timestamp={value.timestamp?.toDate().toISOString()}
                username={value.username}
                caption={value.caption}
                navigation={navigation}
                propic={value.propic}
                piclikes={value.likes}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
export default Userprofile;
