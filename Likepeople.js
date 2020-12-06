import React, { useState, useEffect } from 'react';
import { View, Image, Text, Button } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { db, auth } from './firebase.js';
import { Video } from 'expo-av';

function Likedpoeple({ username, userid, navigation, propic, imageurl,videourl }) {
  const user = auth.currentUser;

  return (
    <View style={{ backgroundColor: 'black' }}>
      <ListItem containerStyle={{ backgroundColor: 'black' }}>
        <Avatar
          size="medium"
          rounded
          source={{
            uri: `${propic}`,
          }}
        />
        <ListItem.Content>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <ListItem.Title style={{ color: 'white' }}>
              {username}
            </ListItem.Title>
            <Text
              style={{
                color: 'white',
                marginLeft: 4,
                margin: 1,
                fontSize: 16,
              }}>
              is liked your post{' '}
            </Text>
            {imageurl?(
              <Image
              source={{ uri: `${imageurl}` }}
              style={{
                resizeMode: 'contain',
                width: 50,
                height: 50,
                borderRadius: 7,
              }}
            />
            ):(
              <Video
  source={{ uri: `${videourl}`}}
  rate={1.0}
  volume={1.0}
  isMuted={true}
  resizeMode="cover"
  shouldPlay
  isLooping
  style={{ width: 50, height: 50 }}
/>
            )}
            
          </View>
        </ListItem.Content>
      </ListItem>
    </View>
  );
}
export default Likedpoeple;
