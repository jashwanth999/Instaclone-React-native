import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Header, Avatar } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { db, auth } from './firebase.js';
function Storyview({ navigation, route }) {
  const user = auth.currentUser;

  const { story, id, username, propic } = route.params;
  setTimeout(function () {
    navigation.goBack();
  }, 4000);

  return (
    <View style={{ backgroundColor: 'black', height: '100%' }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
          borderBottomColor: 'none',
        }}
        placement="left"
        centerComponent={
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Avatar
              rounded
              source={{
                uri: `${propic}`,
              }}
            />
            <Text
              style={{ fontSize: 20, marginLeft: 10, color: 'white' }}
              onPress={() =>
                navigation.navigate('userprofile', {
                  username: username,
                  userid: id,
                })
              }>
              {username}
            </Text>
          </View>
        }
      />
      {story && (
        <Image
          source={{ uri: story }}
          style={{ width: 360, height:700, resizeMode: 'contain' }}
        />
      )}

      <Text>{id}</Text>
    </View>
  );
}
export default Storyview;
