import React from 'react';
import { View, Text, Image } from 'react-native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements';

export default function Splashscreen({ navigation }) {
  setTimeout(() => {
    navigation.navigate('mytabs');
  }, 2000);
  return (
    <View
      style={{
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        height: '100%',
      }}>
      <Avatar
        rounded
        source={{
          uri:
            'https://firebasestorage.googleapis.com/v0/b/fir-project-ee3f8.appspot.com/o/propics%2Fpropic?alt=media&token=dab448b8-9d32-4727-9dd1-fb0eb37fcd88',
        }}
        size="large"
      />
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          width: '100%',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            margin: '4%',
          }}>
          from
        </Text>
        <Text style={{ color: '#8A2BE2', fontSize: 28, fontWeight: 'bold' }}>
          Jashwanth
        </Text>
      </View>
    </View>
  );
}
