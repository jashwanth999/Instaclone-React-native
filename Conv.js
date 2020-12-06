import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { db } from './firebase.js';
import { Button, Overlay } from 'react-native-elements';
import { Video } from 'expo-av';
function Conv({
  user,
  user_id_1,
  user_id_2,
  username,
  chat,
  roomid,
  propic,
  chatimage,
  id,
  video,
}) {
  const [visible, setVisible] = useState(false);
  const [chats, setChats] = useState([]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View style={{ marginTop: 5 }}>
      {(user_id_1 === user.uid && user_id_2 === roomid) ||
      (user_id_2 === user.uid && user_id_1 === roomid) ? (
        username === user.displayName ? (
          chatimage || video ? (
            chatimage ? (
              <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <TouchableOpacity onLongPress={toggleOverlay}>
                  <View style={{ position: 'relative', left: '10%' }}></View>
                  <View
                    style={{
                      height: 'auto',
                      backgroundColor: 'black',
                      borderWidth: 0.3,
                      borderColor: 'white',
                      borderRadius: 10,
                    }}>
                    <Image
                      source={{ uri: chatimage }}
                      style={{ width: 200, height: 200, resizeMode: 'contain' }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <TouchableOpacity onLongPress={toggleOverlay}>
                  <View style={{ position: 'relative', left: '10%' }}></View>
                  <View
                    style={{
                      height: 'auto',
                      backgroundColor: 'black',
                      borderWidth: 0.3,
                      borderColor: 'white',
                      borderRadius: 10,
                    }}>
                    <Video
                      source={{ uri: `${video}` }}
                      rate={1.0}
                      volume={1.0}
                      isMuted={true}
                      resizeMode="cover"
                      shouldPlay
                      isLooping
                      style={{ width: 200, height: 200 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <TouchableOpacity onLongPress={toggleOverlay}>
                <View style={{ position: 'relative', left: '10%' }}></View>
                <View
                  style={{
                    height: 'auto',
                    backgroundColor: 'black',
                    borderWidth: 0.3,
                    borderColor: 'white',
                    borderRadius: 10,
                    android: {
                      elevation: 4,
                    },
                  }}>
                  <Text style={{ color: 'white', fontSize: 18, padding: 6 }}>
                    {chat}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        ) : chatimage ? (
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Avatar
              rounded
              source={{
                uri: `${propic}`,
              }}
            />
            <View
              style={{
                height: 'auto',
                backgroundColor: 'black',
                borderWidth: 0.3,
                borderColor: 'white',
                borderRadius: 10,
              }}>
              <Image
                source={{ uri: chatimage }}
                style={{ width: 200, height: 200, resizeMode: 'contain' }}
              />
            </View>
          </View>
        ) : (
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Avatar
              rounded
              source={{
                uri: `${propic}`,
              }}
            />
            <View
              style={{
                height: 'auto',
                backgroundColor: 'black',
                maxWidth: 180,
                borderWidth: 0.3,
                borderColor: 'white',
                borderRadius: 10,
              }}>
              <Text style={{ color: 'white', fontSize: 18, padding: 6 }}>
                {chat}
              </Text>
            </View>
          </View>
        )
      ) : (
        <View style={{ display: 'none' }}></View>
      )}
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text
          onPress={() => db.collection('messages').doc(id).delete()}
          style={{ color: '#E42F19', fontSize: 20, fontWeight: 'bold' }}>
          {' '}
          Unsend
        </Text>
      </Overlay>
    </View>
  );
}

export default Conv;
