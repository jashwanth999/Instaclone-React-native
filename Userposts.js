import React from 'react';
import { View, Text } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { auth } from './firebase.js';
function Userposts({
  imageurl,
  username,
  navigation,
  id,
  propic,
  likes,
  caption,
  timestamp,
  piclikes,
  user,
}) {
  return (
    <View style={{ width: 120 }}>
      {user === username ? (
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
          <Card.Cover
            style={{ height: 120, width: 120 }}
            source={{ uri: `${imageurl}` }}
          />
        </Card>
      ) : (
        <View></View>
      )}
    </View>
  );
}
export default Userposts;
