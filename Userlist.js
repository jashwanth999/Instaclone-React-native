import React from 'react';
import { View, Image } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { auth } from './firebase.js';
function Userlist({ username, id, navigation, propic }) {
  const user = auth.currentUser;

  return (
    <View style={{ backgroundColor: 'black' }}>
      {user?.displayName === username ? (
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
              style={{ color: 'white' }}
              onPress={() => navigation.navigate('Profile')}>
              {username}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ) : (
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
              style={{ color: 'white' }}
              onPress={() =>
                navigation.navigate('userprofile', {
                  userid: id,
                  username: username,
                })
              }>
              {username}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      )}
    </View>
  );
}
export default Userlist;
