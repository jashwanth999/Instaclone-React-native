import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { db, auth } from './firebase.js';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Header } from 'react-native-elements';
import { ListItem, Avatar } from 'react-native-elements';
function FollowView({ navigation, route }) {
  const { id } = route.params;
  const [followerslist, setFollowerslist] = useState([]);
  useEffect(() => {
    db.collection('users')
      .doc(id)
      .collection('followers')
      .onSnapshot((snapshot) => {
        setFollowerslist(snapshot.docs.map((doc) => doc.data()));
      });
  }, [id]);
  return (
    <View style={{ backgroundColor: 'black', height: '100%' }}>
      <Header
        containerStyle={{
          backgroundColor: 'black',
        }}
        placement="left"
        leftComponent={
          <Icons
            onPress={() => navigation.goBack()}
            name={'arrow-back'}
            size={30}
            color="white"
            style={{ marginLeft: '3%' }}
          />
        }
        centerComponent={{
          text: 'Followers',
          style: { color: 'white', fontSize: 23, marginRight: 30 },
        }}
      />
      <View style={{ margin: 10 }}>
        <ScrollView style={{ height: '55%' }}>
          {followerslist.map((f) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('userprofile', {
                  userid: f.followerid,
                  username: f.username,
                })
              }>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  backgroundColor: 'black',
                }}>
                <View style={{ margin: 10 }}>
                  <Avatar
                    rounded
                    source={{
                      uri: `${f.userpropic}`,
                    }}
                    size="medium"
                  />
                </View>
                <Text
                  style={{
                    position: 'relative',
                    top: 12,
                    margin: 6,
                    fontSize: 17,
                    marginLeft: 20,
                    color: 'white',
                  }}>
                  {f.username}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
export default FollowView;
