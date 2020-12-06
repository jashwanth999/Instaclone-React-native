import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { Video } from 'expo-av';
import { auth } from './firebase.js';
function Myposts({
  imageurl,
  username,
  navigation,
  id,
  propic,
  likes,
  caption,
  timestamp,
  piclikes,
  mainpropic,
  videourl
}) {
  const [images, setImages] = useState([]);
  if (username === user) {
    setImages(imageurl);
  }

  const user = auth.currentUser;
  return (
    <View style={{ width: 120 }}>
      {user?.displayName === username ? (
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
              mainpropic:mainpropic,
              videourl
            })
          }>
          {imageurl?(
             <Card.Cover
            style={{
              width: 119,
              height: 119,
              borderColor: 'black',
              borderWidth: 1,
            }}
            source={{ uri: `${imageurl}` }}
          />
          ):(
            <Video
  source={{ uri: `${videourl}` }}
  rate={1.0}
  volume={1.0}
  isMuted={false}
  resizeMode="cover"
  shouldPlay
  isLooping
  style={{ width: 119, height: 119 }}
/>
          )}
         
        </Card>
      ) : (
        <View></View>
      )}
    </View>
  );
}
export default Myposts;
