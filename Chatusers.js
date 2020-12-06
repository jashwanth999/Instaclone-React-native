import React from 'react';
import { View, Image } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { auth } from './firebase.js';
import { MaterialCommunityIcons } from '@expo/vector-icons';
function Chatusers({ username, id, navigation, propic }) {
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
          <ListItem.Title
            style={{ color: 'white', fontSize: 18, marginLeft: 10 }}
            onPress={() =>
              navigation.navigate('chatfeeds', {
                roomid: id,
                username: username,
                propic: propic,
              })
            }>
            {username}
          </ListItem.Title>
        </ListItem.Content>
        <View>
          <MaterialCommunityIcons
            onPress={() =>
              navigation.navigate('cam2', {
                propic: propic,
                id: id,
                username: username,
              })
            }
            name="camera-outline"
            size={30}
            color="gray"
            style={{ marginLeft: '3%' }}
          />
        </View>
      </ListItem>
    </View>
  );
}
export default Chatusers;
