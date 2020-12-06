import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Avatar } from 'react-native-elements';
import { BottomSheet } from 'react-native-btr';
import { db, auth } from './firebase.js';
import firebase from '@firebase/app';
function Comments({ propic, username, comment, id, mainpropic, imageid }) {
  const [visible, setVisible] = useState(false);
  const user = auth.currentUser;
  const [reply, setreply] = useState(`@${username} `);
  const [replies, setReplies] = useState([]);
  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };
  const [isvisible, setisVisible] = useState(false);

  const toggleOverlay = () => {
    setisVisible(!isvisible);
  };
  const sendreply = () => {
    db.collection('images')
      .doc(imageid)
      .collection('comments')
      .doc(id)
      .collection('reply')
      .add({
        reply: reply,
        username: user.displayName,
        mainpropic: mainpropic,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setreply('');
    toggleBottomNavigationView();
  };
  useEffect(() => {
    try {
      db.collection('images')
        .doc(imageid)
        .collection('comments')
        .doc(id)
        .collection('reply')
        .onSnapshot((snapshot) => {
          setReplies(
            snapshot.docs.map((doc) => ({
              value: doc.data(),
            }))
          );
        });
    } catch (error) {
      alert(error);
    }
  }, []);
  return (
    <View>
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        <View style={{ display: 'flex', flexDirection: 'row', margin: 10 }}>
          <Avatar
            rounded
            source={{
              uri: `${propic}`,
            }}
          />
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
              color: 'white',
              position: 'relative',
              top: 2,
            }}>
            {username}
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
              color: 'white',
              position: 'relative',
              top: 2,
            }}>
            {comment}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View style={{ fontSize: 16, flex: 0.2 }}>
            <Text style={{ color: 'grey' }}>2h</Text>
          </View>
          <View style={{ fontSize: 16, flex: 0.2 }}>
            <Text style={{ color: 'grey' }}>likes</Text>
          </View>

          <TouchableOpacity style={{}} onPress={() => setVisible(true)}>
            <Text style={{ color: 'grey', fontSize: 16 }}> reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ width: '70%', position: 'relative', left: '20%' }}>
        {replies.map(({ value }) => (
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Avatar
              rounded
              source={{
                uri: `${value.mainpropic}`,
              }}
            />
            <Text style={{ color: 'white', marginRight: '2%' }}>
              {value.username}
            </Text>
            <Text style={{ color: 'white' }}>{value.reply}</Text>
          </View>
        ))}
      </View>
      <BottomSheet
        visible={visible}
        onBackButtonPress={toggleBottomNavigationView}
        onBackdropPress={toggleBottomNavigationView}>
        <View
          style={{
            width: '100%',
            height: 200,
            backgroundColor: 'black',
            borderRadius: 25,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderColor: 'gray',
              position: 'absolute',
              width: '100%',
              alignItems: 'center',
              alignContent: 'center',
              backgroundColor: '#383838',
              bottom: 0,
              height: 50,
            }}>
            <View
              style={{
                margin: 1,
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
              }}>
              <View style={{ margin: 5 }}>
                <Avatar
                  rounded
                  source={{
                    uri: `${mainpropic}`,
                  }}
                />
              </View>
              <View style={{ width: '60%', margin: 3 }}>
                <TextInput
                  style={{
                    height: 40,
                    outline: 'none',
                    marginLeft: 6,
                    color: 'white',
                    fontSize: 18,
                  }}
                  onChangeText={(reply) => setreply(reply)}
                  value={reply}
                  placeholder=""
                  placeholderTextColor="white"
                  textColor="white"
                />
              </View>
            </View>

            <TouchableOpacity style={{}} onPress={sendreply}>
              <Text style={{ color: '#24a0ed', fontSize: 20 }}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
export default Comments;
