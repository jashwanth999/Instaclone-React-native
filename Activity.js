import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { db, auth } from './firebase.js';
import { Header } from 'react-native-elements';
import ActivityFollowers from './ActivityFollowers.js';
import Likedpeople from './Likepeople.js';
function Activity({ navigation }) {
  const user = auth.currentUser;
  const [follower, setFollowers] = useState([]);
  const [likes, setLikes] = useState([]);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('followers')
      .onSnapshot((snapshot) => {
        setFollowers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data(),
          }))
        );
      });
  }, []);
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('likes')

      .onSnapshot((snapshot) => {
        setLikes(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <View style={{ backgroundColor: 'black', height: '100%' }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
          borderBottomColor: 'none',
        }}
        placement="left"
        leftComponent={{
          text: 'Activity',
          style: { color: 'white', fontSize: 23, marginRight: 30 },
        }}
      />
      {follower.map(({ id, users }) => (
        <ActivityFollowers
          user={user}
          username={users.username}
          propic={users.userpropic}
          userid={users.followerrid}
        />
      ))}
      {likes.map(({ id, value }) => (
        <Likedpeople
          user={user}
          username={value.likername}
          propic={value.likerpic}
          userid={value.likerid}
          imageurl={value.imageurl}
          videourl={value.videourl}
        />
      ))}
    </View>
  );
}
export default Activity;
