import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { db, auth } from './firebase.js';
import SearchPost from './SearchPost.js';
function Search({ navigation }) {
  const [images, setImages] = useState([]);
  const user = auth.currentUser;
  useEffect(() => {
    db.collection('images')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setImages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }))
        );
      });
  }, []);
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
          <TouchableOpacity
            onPress={() => navigation.navigate('searchpeople')}
            style={{ width: '100%' }}>
            <View
              style={{
                height: 40,
                backgroundColor: '#383838',
                outline: 'none',
                width: '100%',
                borderRadius: 10,
              }}>
              <Text style={{ color: 'white', fontSize: 17, padding: 10 }}>
                {' '}
                Search
              </Text>
            </View>
          </TouchableOpacity>
        }
      />
      <ScrollView style={{ height: 590 }}>
        <View
          style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {images.map(({ id, value }) => (
            <SearchPost
              key={id}
              id={id}
              imageurl={value.photourl}
              user={user}
              timestamp={value.timestamp?.toDate().toISOString()}
              username={value.username}
              caption={value.caption}
              navigation={navigation}
              propic={value.propic}
              piclikes={value.likes}
              videourl={value.videourl}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
export default Search;
