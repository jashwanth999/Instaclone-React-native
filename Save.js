import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { db, auth } from './firebase.js';
import SearchPost from './SearchPost.js';
import { Video } from 'expo-av';
import Savepost from './Savepost.js'
function Save({ navigation }) {
  const [images, setImages] = useState([]);
  const user = auth.currentUser;
  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .collection('saved')
      .onSnapshot((snapshot) => {
        setImages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        )
      });
  }, [user.uid]);
  return (
    <View style={{ backgroundColor: 'black', height: '100%' }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
        }}
        leftComponent={
          <Icons
            onPress={() => navigation.navigate('Home')}
            name={'arrow-back'}
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
        centerComponent={
          <Text style={{ color: 'white', fontSize: 20, padding: 10 }}>
            {' '}
            Saved
          </Text>
        }
      />
      <ScrollView style={{ height: 590 }}>
        <View
          style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {images.map( ({id,value})  => (
            <Savepost
              key={id}
              id={id}
              imageurl={value.imageurl}
              user={user}
      
              navigation={navigation}
           
              videourl={value.videourl}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
export default Save;
