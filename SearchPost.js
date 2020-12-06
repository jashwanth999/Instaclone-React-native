import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { auth } from './firebase.js';
import { Video } from 'expo-av';
function SearchPost({
  imageurl,
  username,
  navigation,
  id,
  propic,
  likes,
  caption,
  timestamp,
  piclikes,
  videourl
}) {
  const user = auth.currentUser;
  return (
    <View style={{ width: 120 }}>
      <Card
        onPress={() =>
          navigation.navigate('profilepost', {
            imageurl: imageurl,
            username: username,
            id: id,
            propic: propic,
            caption: caption,
            timestamp: timestamp,
            piclikes: piclikes,
          })
        }>
        {imageurl?(
          <Card.Cover
          style={{ width: 120, height: 120 }}
          source={{ uri: `${imageurl}` }}
        />
        ):(
          <Video
  source={{ uri: `${videourl}` }}
  rate={1.0}
  volume={1.0}
  isMuted={true}
  resizeMode="cover"
  shouldPlay
  isLooping
  style={{ width: 120, height: 120 }}
/>
        )}
        
      </Card>

      <View></View>
    </View>
  );
}
export default SearchPost;
